import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { updateJsonFile } from "./github-storage.js";

const PORT = process.env.PORT || 10000;
const COOKIE_NAME = "ron_lore_session";
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
const SAFE_NAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

const app = express();

function getAllowedFrontendOrigins() {
  return (process.env.FRONTEND_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
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
  credentials: true
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

const missionSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().optional()
  })
  .passthrough();

const jsonObjectSchema = z
  .record(z.unknown())
  .refine((value) => !Array.isArray(value), "Root JSON value must be an object");

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
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
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    editor: true,
    iat: now,
    exp: now + SESSION_TTL_SECONDS
  };
  const encodedPayload = base64UrlJson(payload);
  const signature = sign(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

function verifySessionToken(token) {
  if (!token || typeof token !== "string") {
    return false;
  }

  const [encodedPayload, signature, extra] = token.split(".");
  if (!encodedPayload || !signature || extra) {
    return false;
  }

  const expectedSignature = sign(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    return payload.editor === true && Number.isInteger(payload.exp) && payload.exp > now;
  } catch {
    return false;
  }
}

function sessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: SESSION_TTL_SECONDS * 1000,
    path: "/"
  };
}

function requireEditor(req, res, next) {
  if (!verifySessionToken(req.cookies[COOKIE_NAME])) {
    res.status(401).json({ error: "Authentication required" });
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

app.post(
  "/auth/login",
  loginLimiter,
  asyncRoute(async (req, res) => {
    const parsedBody = loginSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ error: "Invalid login payload" });
      return;
    }

    const passwordHash = requiredEnv("EDITOR_PASSWORD_HASH");
    const authenticated = await bcrypt.compare(parsedBody.data.password, passwordHash);

    if (!authenticated) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    res.cookie(COOKIE_NAME, createSessionToken(), sessionCookieOptions());
    res.json({ authenticated: true });
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
  res.json({ authenticated: verifySessionToken(req.cookies[COOKIE_NAME]) });
});

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
      parsedMission.data,
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
      parsedEntity.data,
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
      parsedSource.data,
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
