import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import sharp from "sharp";
import { getJsonFiles, getLatestCommit, updateBinaryFile, updateJsonFile } from "./github-storage.js";

const PORT = process.env.PORT || 10000;
const COOKIE_NAME = process.env.NODE_ENV === "production" ? "__Host-ron_lore_session" : "ron_lore_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const SAFE_NAME_PATTERN = /^[a-zA-Z0-9_-]+$/;
const DEFAULT_FRONTEND_ORIGINS = [
  "https://ron-lore.online",
  "https://admin.ron-lore.online",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

const app = express();
const activeSessions = new Map();

function getAllowedFrontendOrigins() {
  const envOrigins = (process.env.FRONTEND_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...new Set([...DEFAULT_FRONTEND_ORIGINS, ...envOrigins])];
}

const corsOptions = {
  origin(origin, callback) {
    const allowedOrigins = getAllowedFrontendOrigins();

    if (!origin) {
      callback(null, true);
      return;
    }

    callback(null, allowedOrigins.includes(origin));
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Accept", "X-CSRF-Token"],
  methods: ["GET", "POST", "PUT", "OPTIONS"]
};

app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use((req, res, next) => {
  const origin = req.get("Origin");
  if (origin && !getAllowedFrontendOrigins().includes(origin)) {
    res.status(403).json({ error: "Origin not allowed" });
    return;
  }
  next();
});
app.options("*", cors(corsOptions));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts" }
});

const loginSchema = z.object({
  password: z.string().min(12).max(256)
}).strict();

const presenceSchema = z.object({
  missionId: z.string().min(1).max(120),
  title: z.string().max(200).optional(),
  action: z.enum(["editing", "viewing", "saving"]).optional()
}).strict();

const missionSchema = z
  .object({
    schema: z.literal("ron-lore-mission-db-v1").optional(),
    id: z.string().regex(SAFE_NAME_PATTERN),
    localId: z.string().max(200).optional(),
    missionId: z.string().max(200).optional(),
    title: z.string().max(200).optional(),
    dlc: z.object({ id: z.string().max(100), name: z.string().max(200) }).strict().optional(),
    date: z.string().max(40).optional(),
    summary: z.string().max(20000).optional(),
    summaryHtml: z.string().max(50000).optional(),
    tags: z.array(z.string().max(60)).max(30).optional(),
    people: z.object({
      civilians: z.array(z.record(z.unknown())).max(100).optional(),
      suspects: z.array(z.record(z.unknown())).max(100).optional()
    }).strict().optional(),
    evidence: z.array(z.record(z.unknown())).max(100).optional(),
    notes: z.object({ freeform: z.string().max(50000).optional() }).strict().optional(),
    visual: z.object({
      sections: z.array(z.record(z.unknown())).max(100).optional(),
      blocks: z.array(z.record(z.unknown())).max(200).optional()
    }).strict().optional(),
    ai: z.object({
      facts: z.array(z.unknown()).max(100).optional(),
      hypotheses: z.array(z.unknown()).max(100).optional(),
      questions: z.array(z.unknown()).max(100).optional()
    }).strict().optional(),
    updatedBy: z.string().max(200).optional(),
    updatedAt: z.string().max(50).optional(),
    pushedAt: z.string().max(50).optional()
  })
  .strict();

const jsonObjectSchema = z
  .record(z.unknown())
  .refine((value) => !Array.isArray(value), "Root JSON value must be an object");

const assetUploadSchema = z.object({
  name: z.string().min(1).max(120),
  dataUrl: z.string().max(8_000_000)
}).strict();
const ASSET_CATEGORIES = new Set(["evidence", "people", "reports"]);

const activePresence = new Map();
const PRESENCE_TTL_MS = 30 * 1000;
const STEAM_SUMMARY_CACHE_MS = 5 * 60 * 1000;
let steamCreatorCache = {
  expiresAt: 0,
  data: null
};
const READY_OR_NOT_STEAM_APP_ID = 1144200;

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getEditorUsers() {
  const usersJson = process.env.EDITOR_USERS;

  if (usersJson) {
    const parsed = JSON.parse(usersJson);
    if (!Array.isArray(parsed)) {
      throw new Error("EDITOR_USERS must be a JSON array");
    }

    return parsed.map((user, index) => {
      if (!user || typeof user !== "object" || !user.name || !user.passwordHash) {
        throw new Error(`Invalid editor user at index ${index}`);
      }

      return {
        name: String(user.name),
        passwordHash: String(user.passwordHash)
      };
    });
  }

  return [
    {
      name: process.env.EDITOR_NAME || "Admin",
      passwordHash: requiredEnv("EDITOR_PASSWORD_HASH")
    }
  ];
}

function getSteamCreatorsConfig() {
  const creatorsJson = process.env.STEAM_CREATORS || "[]";
  const parsed = JSON.parse(creatorsJson);

  if (!Array.isArray(parsed)) {
    throw new Error("STEAM_CREATORS must be a JSON array");
  }

  return parsed
    .map((creator, index) => {
      if (!creator || typeof creator !== "object") {
        throw new Error(`Invalid Steam creator at index ${index}`);
      }

      const steamId = creator.steamId ? String(creator.steamId) : "";
      const vanityUrl = creator.vanityUrl ? String(creator.vanityUrl) : "";
      const fallbackName = creator.name ? String(creator.name) : "";
      const profileUrl = creator.profileUrl ? String(creator.profileUrl) : "";

      if (!steamId && !vanityUrl && !profileUrl) {
        throw new Error(`Steam creator at index ${index} needs steamId, vanityUrl, or profileUrl`);
      }

      return {
        steamId,
        vanityUrl: vanityUrl || getSteamVanityFromProfileUrl(profileUrl),
        fallbackName,
        role: creator.role ? String(creator.role) : "Createur",
        profileUrl,
        note: creator.note ? String(creator.note) : ""
      };
    });
}

function getSteamVanityFromProfileUrl(profileUrl) {
  const match = String(profileUrl || "").match(/steamcommunity\.com\/id\/([^/?#]+)/i);
  return match ? decodeURIComponent(match[1]) : "";
}

async function resolveSteamVanityUrl(vanityUrl) {
  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey || !vanityUrl) return "";

  const url = new URL("https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("vanityurl", vanityUrl);

  const response = await fetch(url);
  if (!response.ok) return "";

  const body = await response.json();
  return body.response?.success === 1 ? String(body.response.steamid || "") : "";
}

async function resolveSteamCreatorIds(creators) {
  return Promise.all(creators.map(async creator => {
    if (creator.steamId || !creator.vanityUrl) return creator;
    return {
      ...creator,
      steamId: await resolveSteamVanityUrl(creator.vanityUrl)
    };
  }));
}

async function fetchSteamPlayerSummaries(creators) {
  const apiKey = process.env.STEAM_API_KEY;
  const steamIds = creators.map(creator => creator.steamId).filter(Boolean);

  if (!apiKey || steamIds.length === 0) {
    return new Map();
  }

  const url = new URL("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("steamids", steamIds.join(","));

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Steam profile fetch failed");
  }

  const body = await response.json();
  const players = body.response?.players || [];
  return new Map(players.map(player => [String(player.steamid), player]));
}

async function fetchSteamReadyOrNotPlaytimes(creators) {
  const apiKey = process.env.STEAM_API_KEY;
  const steamIds = creators.map(creator => creator.steamId).filter(Boolean);

  if (!apiKey || steamIds.length === 0) {
    return new Map();
  }

  const entries = await Promise.all(steamIds.map(async steamId => {
    const url = new URL("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("steamid", steamId);
    url.searchParams.set("appids_filter[0]", String(READY_OR_NOT_STEAM_APP_ID));
    url.searchParams.set("format", "json");

    try {
      const response = await fetch(url);
      if (!response.ok) return [steamId, null];
      const body = await response.json();
      const game = body.response?.games?.find(item => Number(item.appid) === READY_OR_NOT_STEAM_APP_ID);
      return [steamId, Number.isFinite(game?.playtime_forever) ? game.playtime_forever : null];
    } catch {
      return [steamId, null];
    }
  }));

  return new Map(entries);
}

async function getSteamCreators() {
  const now = Date.now();
  if (steamCreatorCache.data && steamCreatorCache.expiresAt > now) {
    return steamCreatorCache.data;
  }

  const creators = await resolveSteamCreatorIds(getSteamCreatorsConfig());
  const [summaries, readyOrNotPlaytimes] = await Promise.all([
    fetchSteamPlayerSummaries(creators),
    fetchSteamReadyOrNotPlaytimes(creators)
  ]);
  const data = creators.map(creator => {
    const steamProfile = summaries.get(creator.steamId) || {};
    const profileUrl = steamProfile.profileurl || creator.profileUrl || (
      creator.steamId ? `https://steamcommunity.com/profiles/${creator.steamId}` : ""
    );

    return {
      name: steamProfile.personaname || creator.fallbackName || "Createur",
      role: creator.role,
      note: creator.note,
      steamId: creator.steamId,
      profileUrl,
      avatar: steamProfile.avatarfull || steamProfile.avatarmedium || "",
      status: Number.isInteger(steamProfile.personastate) ? steamProfile.personastate : null,
      game: steamProfile.gameextrainfo || "",
      gameId: steamProfile.gameid || "",
      readyOrNotPlaytimeMinutes: readyOrNotPlaytimes.get(creator.steamId) ?? null,
      lastLogoff: steamProfile.lastlogoff ? new Date(steamProfile.lastlogoff * 1000).toISOString() : null
    };
  });

  steamCreatorCache = {
    expiresAt: now + STEAM_SUMMARY_CACHE_MS,
    data
  };

  return data;
}

function base64UrlEncode(input) {
  return Buffer.from(input).toString("base64url");
}

function base64UrlJson(value) {
  return base64UrlEncode(JSON.stringify(value));
}

function sign(value) {
  return crypto
    .createHmac("sha256", requiredEnv("SESSION_SECRET"))
    .update(value)
    .digest("base64url");
}

function createSessionToken() {
  return createEditorSessionToken("Admin");
}

function createEditorSessionToken(editorName) {
  const now = Math.floor(Date.now() / 1000);
  for (const [sessionId, expiresAt] of activeSessions.entries()) {
    if (expiresAt <= now) activeSessions.delete(sessionId);
  }
  const sid = crypto.randomBytes(24).toString("base64url");
  const csrf = crypto.randomBytes(24).toString("base64url");
  const payload = {
    editor: true,
    name: editorName,
    sid,
    csrf,
    iat: now,
    exp: now + SESSION_TTL_SECONDS
  };
  const encodedPayload = base64UrlJson(payload);
  const signature = sign(encodedPayload);
  activeSessions.set(sid, payload.exp);

  return `${encodedPayload}.${signature}`;
}

function getSessionPayload(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const [encodedPayload, signature, extra] = token.split(".");
  if (!encodedPayload || !signature || extra) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    if (payload.editor === true && typeof payload.sid === "string" && typeof payload.csrf === "string" && Number.isInteger(payload.exp) && payload.exp > now && activeSessions.get(payload.sid) === payload.exp) {
      return payload;
    }
    return null;
  } catch {
    return null;
  }
}

function verifySessionToken(token) {
  return Boolean(getSessionPayload(token));
}

function sessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: SESSION_TTL_SECONDS * 1000,
    path: "/"
  };
}

function requireEditor(req, res, next) {
  const session = getSessionPayload(req.cookies[COOKIE_NAME]);

  if (!session) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  req.editor = {
    name: typeof session.name === "string" && session.name.trim() ? session.name.trim() : "Admin"
  };
  req.editorSession = session;
  next();
}

function requireCsrf(req, res, next) {
  const supplied = req.get("X-CSRF-Token");
  const expected = req.editorSession?.csrf;
  if (!supplied || !expected) {
    res.status(403).json({ error: "CSRF token required" });
    return;
  }
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);
  if (suppliedBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)) {
    res.status(403).json({ error: "Invalid CSRF token" });
    return;
  }
  next();
}

function isPlainJsonObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertSafeName(value) {
  if (typeof value !== "string" || !SAFE_NAME_PATTERN.test(value)) {
    const error = new Error("Invalid file identifier");
    error.status = 400;
    throw error;
  }

  return value;
}

function commitSafeTitle(value) {
  return value.replace(/_/g, "-");
}

function sanitizeMissionPayload(payload) {
  const clean = structuredClone(payload);
  if (typeof clean.summaryHtml === "string") {
    clean.summaryHtml = sanitizeHtml(clean.summaryHtml, {
      allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "span", "div", "ul", "ol", "li"],
      allowedAttributes: { "*": ["style"] },
      allowedStyles: { "*": { color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s,.%]+\)$/i] } },
      disallowedTagsMode: "discard"
    });
  }
  return clean;
}

function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

app.get("/healthz", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/status", (req, res) => {
  res.json({
    ok: true,
    service: "RoN Lore Backend",
    auth: "render-webservice"
  });
});

app.get(
  "/creators/steam",
  asyncRoute(async (req, res) => {
    const creators = await getSteamCreators();

    res.set("Cache-Control", "public, max-age=300");
    res.json({
      updatedAt: new Date().toISOString(),
      creators
    });
  })
);

app.get(
  "/data/missions",
  asyncRoute(async (req, res) => {
    const files = await getJsonFiles("data/missions");

    res.set("Cache-Control", "no-store");
    res.json({
      schema: "ron-lore-mission-db-index-v1",
      updatedAt: new Date().toISOString(),
      missions: files.map(file => ({
        path: file.path,
        sha: file.sha,
        ...file.data
      }))
    });
  })
);

app.get("/presence", requireEditor, (req, res) => {
  const now = Date.now();
  const editors = [];

  for (const [name, presence] of activePresence.entries()) {
    if (now - presence.seenAt > PRESENCE_TTL_MS) {
      activePresence.delete(name);
      continue;
    }

    editors.push({
      name,
      missionId: presence.missionId,
      title: presence.title,
      action: presence.action,
      seenAt: new Date(presence.seenAt).toISOString()
    });
  }

  res.set("Cache-Control", "no-store");
  res.json({ editors });
});

app.post(
  "/presence",
  requireEditor,
  requireCsrf,
  (req, res) => {
    const parsedPresence = presenceSchema.safeParse(req.body);
    if (!parsedPresence.success) {
      res.status(400).json({ error: "Invalid presence payload" });
      return;
    }

    activePresence.set(req.editor.name, {
      ...parsedPresence.data,
      action: parsedPresence.data.action || "editing",
      seenAt: Date.now()
    });

    res.json({ ok: true });
  }
);

app.post(
  "/auth/login",
  loginLimiter,
  asyncRoute(async (req, res) => {
    const parsedBody = loginSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ error: "Invalid login payload" });
      return;
    }

    const editorUsers = getEditorUsers();

    let authenticatedUser = null;
    for (const user of editorUsers) {
      if (await bcrypt.compare(parsedBody.data.password, user.passwordHash)) {
        authenticatedUser = user;
        break;
      }
    }

    if (!authenticatedUser) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = createEditorSessionToken(authenticatedUser.name);
    const session = getSessionPayload(token);
    res.cookie(COOKIE_NAME, token, sessionCookieOptions());
    res.json({ authenticated: true, csrfToken: session.csrf, editor: { name: authenticatedUser.name } });
  })
);

app.post("/auth/logout", requireEditor, requireCsrf, (req, res) => {
  activeSessions.delete(req.editorSession.sid);
  res.clearCookie(COOKIE_NAME, {
    ...sessionCookieOptions(),
    maxAge: undefined
  });
  res.json({ authenticated: false });
});

app.get("/auth/session", (req, res) => {
  const session = getSessionPayload(req.cookies[COOKIE_NAME]);
  res.json({
    authenticated: Boolean(session),
    csrfToken: session?.csrf || null,
    editor: session ? { name: session.name || "Admin" } : null
  });
});

app.get(
  "/github/latest-commit",
  requireEditor,
  asyncRoute(async (req, res) => {
    const commit = await getLatestCommit();
    res.json({ commit });
  })
);

app.put(
  "/data/missions/:id",
  requireEditor,
  requireCsrf,
  asyncRoute(async (req, res) => {
    const id = assertSafeName(req.params.id);
    const parsedMission = missionSchema.safeParse(req.body);

    if (!parsedMission.success || parsedMission.data.id !== id) {
      res.status(400).json({ error: "Invalid mission payload" });
      return;
    }

    const safeMission = sanitizeMissionPayload(parsedMission.data);
    const result = await updateJsonFile(
      `data/missions/${id}.json`,
      {
        ...safeMission,
        updatedBy: req.editor.name,
        updatedAt: new Date().toISOString()
      },
      `Update mission ${commitSafeTitle(id)} from admin`
    );

    res.json({ ok: true, path: result.path, commit: result.commit });
  })
);

app.put(
  "/data/entities/:file",
  requireEditor,
  requireCsrf,
  asyncRoute(async (req, res) => {
    const file = assertSafeName(req.params.file);
    const parsedEntity = jsonObjectSchema.safeParse(req.body);

    if (!parsedEntity.success || !isPlainJsonObject(parsedEntity.data)) {
      res.status(400).json({ error: "Invalid entity payload" });
      return;
    }

    const result = await updateJsonFile(
      `data/entities/${file}.json`,
      {
        ...parsedEntity.data,
        updatedBy: req.editor.name,
        updatedAt: new Date().toISOString()
      },
      `Update entity ${commitSafeTitle(file)} from admin`
    );

    res.json({ ok: true, path: result.path, commit: result.commit });
  })
);

app.put(
  "/data/sources/:file",
  requireEditor,
  requireCsrf,
  asyncRoute(async (req, res) => {
    const file = assertSafeName(req.params.file);
    const parsedSource = jsonObjectSchema.safeParse(req.body);

    if (!parsedSource.success || !isPlainJsonObject(parsedSource.data)) {
      res.status(400).json({ error: "Invalid source payload" });
      return;
    }

    const result = await updateJsonFile(
      `data/sources/${file}.json`,
      {
        ...parsedSource.data,
        updatedBy: req.editor.name,
        updatedAt: new Date().toISOString()
      },
      `Update source ${commitSafeTitle(file)} from admin`
    );

    res.json({ ok: true, path: result.path, commit: result.commit });
  })
);

app.post(
  "/assets/:category",
  requireEditor,
  requireCsrf,
  asyncRoute(async (req, res) => {
    const category = String(req.params.category || "");
    if (!ASSET_CATEGORIES.has(category)) {
      res.status(400).json({ error: "Invalid asset category" });
      return;
    }
    const parsed = assetUploadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid image payload" });
      return;
    }
    const match = parsed.data.dataUrl.match(/^data:image\/(png|jpe?g|webp);base64,([a-z0-9+/=]+)$/i);
    if (!match) {
      res.status(415).json({ error: "Unsupported image format" });
      return;
    }
    const input = Buffer.from(match[2], "base64");
    if (!input.length || input.length > 5 * 1024 * 1024) {
      res.status(413).json({ error: "Image exceeds the 5 MB limit" });
      return;
    }
    const baseName = parsed.data.name
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || `asset-${Date.now()}`;
    const output = await sharp(input, { failOn: "warning", limitInputPixels: 40_000_000 })
      .rotate()
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();
    const path = `assets/${category}/${baseName}.webp`;
    const result = await updateBinaryFile(path, output, `Upload ${category} asset ${baseName} from admin`);
    res.status(201).json({ ok: true, path, url: result.downloadUrl, commit: result.commit, format: "webp", size: output.length });
  })
);

app.use((err, req, res, next) => {
  const status = err.status || 500;

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    error: status >= 500 ? "Internal server error" : err.message
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`RoN Lore backend listening on 0.0.0.0:${PORT}`);
});
