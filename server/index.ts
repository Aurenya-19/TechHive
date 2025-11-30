import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Enable aggressive gzip compression for all responses
app.use(compression({
  level: 9, // Max compression for 20k+ users
  threshold: 512, // Compress smaller responses too
  filter: (req, res) => {
    if (req.headers["x-no-compression"]) return false;
    return compression.filter(req, res);
  },
}));

app.use(
  express.json({
    limit: "5mb", // Prevent large payloads from 20k+ users
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: "5mb" }));

// Rate limiting middleware for 20k+ users
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 100; // Max 100 requests per minute per IP

app.use((req, res, next) => {
  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const limit = rateLimitMap.get(clientIp);

  if (limit && now < limit.resetTime) {
    limit.count++;
    if (limit.count > RATE_LIMIT_MAX) {
      return res.status(429).json({ error: "Too many requests. Try again later." });
    }
  } else {
    rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  }
  next();
});

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Set cache headers for API responses - optimized for 20k+ users
  if (path.startsWith("/api")) {
    // Different cache times based on endpoint sensitivity
    if (path.includes("/leaderboard") || path.includes("/feed") || path.includes("/arenas")) {
      res.set("Cache-Control", "public, max-age=300, s-maxage=600"); // 5-10 min cache for expensive queries
    } else if (path.includes("/profile") || path.includes("/challenge") || path.includes("/quest")) {
      res.set("Cache-Control", "private, max-age=60"); // 1 min cache for user-specific data
    } else {
      res.set("Cache-Control", "public, max-age=300"); // Default 5 min cache
    }
    res.set("Vary", "Accept-Encoding"); // Vary by compression for CDN efficiency
  }

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const { seedDatabase } = await import("./seed");
  try {
    await seedDatabase();
  } catch (err) {
    console.log("Seed skipped or error:", err);
  }

  const { setupAuth } = await import("./googleAuth");
  await setupAuth(app);
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
