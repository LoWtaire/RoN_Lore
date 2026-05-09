import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { getJsonFiles, getLatestCommit, updateJsonFile } from "./github-storage.js";

const PORT = process.env.PORT || 10000;
const COOKIE_NAME = "ron_lore_session";
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
const SAFE_NAME_PATTERN = /^[a-zA-Z0-9_-]+$/;
const DEFAULT_FRONTEND_ORIGINS = [
  "https://ron-lore.online",
  "https://admin.ron-lore.online",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

const app = express();

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
  allowedHeaders: ["Content-Type", "Accept"],
  methods: ["GET", "POST", "PUT", "OPTIONS"]
};

app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts" }
});

const loginSchema = z.object({
  password: z.string().min(1)
});

const presenceSchema = z.object({
  missionId: z.string().min(1),
  title: z.string().optional(),
  action: z.string().optional()
});

const missionSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().optional()
  })
  .passthrough();

const jsonObjectSchema = z
  .record(z.unknown())
  .refine((value) => !Array.isArray(value), "Root JSON value must be an object");

const activePresence = new Map();
const PRESENCE_TTL_MS = 30 * 1000;
const STEAM_SUMMARY_CACHE_MS = 5 * 60 * 1000;
let steamCreatorCache = {
  expiresAt: 0,
  data: null
};

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

async function getSteamCreators() {
  const now = Date.now();
  if (steamCreatorCache.data && steamCreatorCache.expiresAt > now) {
    return steamCreatorCache.data;
  }

  const creators = await resolveSteamCreatorIds(getSteamCreatorsConfig());
  const summaries = await fetchSteamPlayerSummaries(creators);
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
  const payload = {
    editor: true,
    name: editorName,
    iat: now,
    exp: now + SESSION_TTL_SECONDS
  };
  const encodedPayload = base64UrlJson(payload);
  const signature = sign(encodedPayload);

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
    if (payload.editor === true && Number.isInteger(payload.exp) && payload.exp > now) {
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

app.get("/presence", (req, res) => {
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

    res.cookie(COOKIE_NAME, createEditorSessionToken(authenticatedUser.name), sessionCookieOptions());
    res.json({ authenticated: true, editor: { name: authenticatedUser.name } });
  })
);

app.post("/auth/logout", (req, res) => {
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
  asyncRoute(async (req, res) => {
    const id = assertSafeName(req.params.id);
    const parsedMission = missionSchema.safeParse(req.body);

    if (!parsedMission.success || parsedMission.data.id !== id) {
      res.status(400).json({ error: "Invalid mission payload" });
      return;
    }

    const result = await updateJsonFile(
      `data/missions/${id}.json`,
      {
        ...parsedMission.data,
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
