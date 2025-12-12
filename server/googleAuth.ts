import passport from "passport";
import { Strategy as GoogleOAuthStrategy } from "passport-google-oauth20";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

const MemoryStore = require("memorystore")(session);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  
  // Try database session first, fallback to memory
  try {
    const pgStore = connectPg(session);
    const sessionStore = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      ttl: sessionTtl,
      tableName: "sessions",
    });
    
    sessionStore.on("error", (err) => {
      console.error("[Session] DB error, using memory fallback:", err.message);
    });
    
    return session({
      secret: process.env.SESSION_SECRET || 'codeverse-secret-key-2025',
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: sessionTtl,
      },
    });
  } catch (err) {
    console.log("[Session] Using memory store");
    return session({
      secret: process.env.SESSION_SECRET || 'codeverse-secret-key-2025',
      store: new MemoryStore({ checkPeriod: 86400000 }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: sessionTtl,
      },
    });
  }
}

async function upsertUser(profile: any) {
  const googleId = profile.id;
  const email = profile.emails?.[0]?.value;
  const firstName = profile.name?.givenName || '';
  const lastName = profile.name?.familyName || '';
  const profileImageUrl = profile.photos?.[0]?.value;

  try {
    let existingUser = null;
    if (email) {
      try {
        existingUser = await storage.getUserByEmail(email);
      } catch (err) {
        // User doesn't exist
      }
    }

    const userId = existingUser?.id || googleId;

    await storage.upsertUser({
      id: userId,
      email,
      firstName,
      lastName,
      profileImageUrl,
    });
    
    console.log(`[Auth] ✓ User saved: ${email}`);
    return userId;
  } catch (err: any) {
    console.error("[Auth] User save error:", err.message);
    // Continue anyway - user can still login
    return googleId;
  }
}

function getCallbackURL(): string {
  if (process.env.GOOGLE_CALLBACK_URL) {
    return process.env.GOOGLE_CALLBACK_URL;
  }
  
  if (process.env.NODE_ENV === 'production') {
    return 'https://codeverse-4za9.onrender.com/api/callback';
  }
  
  return 'http://localhost:5000/api/callback';
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const callbackURL = getCallbackURL();
  console.log(`[Auth] OAuth callback: ${callbackURL}`);

  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientID || !clientSecret) {
    throw new Error('Missing Google OAuth credentials');
  }

  passport.use(
    new GoogleOAuthStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          console.log(`[Auth] Login: ${profile.emails?.[0]?.value}`);
          
          await upsertUser(profile);
          
          return done(null, {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            profile,
          });
        } catch (error: any) {
          console.error(`[Auth] Error:`, error.message);
          // Still allow login
          return done(null, {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            profile,
          });
        }
      }
    )
  );

  passport.serializeUser((user: any, cb) => cb(null, user));
  passport.deserializeUser((user: any, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    console.log(`[Auth] Login initiated`);
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  });

  app.get(
    "/api/callback",
    passport.authenticate("google", {
      failureRedirect: "/?error=auth_failed",
    }),
    (req, res) => {
      console.log(`[Auth] ✓ Login successful: ${(req.user as any)?.email}`);
      res.redirect("/");
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) console.error("[Auth] Logout error:", err);
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
