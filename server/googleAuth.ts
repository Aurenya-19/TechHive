import passport from "passport";
import { Strategy as GoogleOAuthStrategy } from "passport-google-oauth20";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";
import { isDatabaseAvailable } from "./db";

const MemoryStore = require("memorystore")(session);

// In-memory user store as fallback
const memoryUsers = new Map<string, any>();

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;
  
  // ALWAYS use memory store for now (database disabled)
  console.log("[Session] Using memory store (database unavailable)");
  
  return session({
    secret: process.env.SESSION_SECRET || 'codeverse-secret-key-2025-emergency',
    store: new MemoryStore({ 
      checkPeriod: 86400000,
      max: 10000, // Store up to 10k sessions
    }),
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

async function saveUser(profile: any) {
  const googleId = profile.id;
  const email = profile.emails?.[0]?.value;
  const firstName = profile.name?.givenName || '';
  const lastName = profile.name?.familyName || '';
  const profileImageUrl = profile.photos?.[0]?.value;

  const userData = {
    id: googleId,
    email,
    firstName,
    lastName,
    profileImageUrl,
  };

  // Save to memory
  memoryUsers.set(googleId, userData);
  if (email) {
    memoryUsers.set(email, userData);
  }
  
  console.log(`[Auth] ✓ User saved to memory: ${email}`);

  // Try database if available (non-blocking)
  if (isDatabaseAvailable()) {
    try {
      const existingUser = await storage.getUserByEmail(email);
      const userId = existingUser?.id || googleId;
      
      await storage.upsertUser({
        id: userId,
        email,
        firstName,
        lastName,
        profileImageUrl,
      });
      
      console.log(`[Auth] ✓ User synced to database: ${email}`);
    } catch (err: any) {
      console.log(`[Auth] ℹ️  Database sync skipped:`, err.message);
      // Continue anyway - memory store is enough
    }
  }
  
  return googleId;
}

function getCallbackURL(): string {
  // Production URL
  if (process.env.NODE_ENV === 'production') {
    return 'https://codeverse-4za9.onrender.com/api/callback';
  }
  
  // Development URL
  return 'http://localhost:5000/api/callback';
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const callbackURL = getCallbackURL();
  console.log(`[Auth] OAuth callback: ${callbackURL}`);
  console.log(`[Auth] Database mode: ${isDatabaseAvailable() ? 'ENABLED' : 'MEMORY-ONLY'}`);

  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientID || !clientSecret) {
    console.error("[Auth] ⚠️  Missing OAuth credentials!");
    console.error("[Auth] Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET");
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
          const email = profile.emails?.[0]?.value;
          console.log(`[Auth] Login attempt: ${email}`);
          
          // Save user (memory + optional DB)
          await saveUser(profile);
          
          const user = {
            id: profile.id,
            email: email,
            name: profile.displayName,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            profileImageUrl: profile.photos?.[0]?.value,
            profile,
          };
          
          console.log(`[Auth] ✓ Login successful: ${email}`);
          return done(null, user);
          
        } catch (error: any) {
          console.error(`[Auth] ⚠️  Error during login:`, error.message);
          
          // Still allow login with basic info
          const user = {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            profile,
          };
          
          console.log(`[Auth] ✓ Login with fallback data`);
          return done(null, user);
        }
      }
    )
  );

  passport.serializeUser((user: any, cb) => {
    console.log(`[Auth] Serializing user: ${user.email}`);
    cb(null, user);
  });
  
  passport.deserializeUser((user: any, cb) => {
    console.log(`[Auth] Deserializing user: ${user.email}`);
    cb(null, user);
  });

  app.get("/api/login", (req, res, next) => {
    console.log(`[Auth] Login initiated from IP: ${req.ip}`);
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account", // Force account selection
    })(req, res, next);
  });

  app.get(
    "/api/callback",
    (req, res, next) => {
      console.log(`[Auth] Callback received`);
      passport.authenticate("google", {
        failureRedirect: "/?error=auth_failed",
        failureMessage: true,
      })(req, res, next);
    },
    (req, res) => {
      const user = req.user as any;
      console.log(`[Auth] ✅ LOGIN SUCCESS: ${user?.email}`);
      console.log(`[Auth] Redirecting to dashboard...`);
      res.redirect("/");
    }
  );

  app.get("/api/logout", (req, res) => {
    const user = req.user as any;
    console.log(`[Auth] Logout: ${user?.email}`);
    
    req.logout((err) => {
      if (err) {
        console.error("[Auth] Logout error:", err);
      }
      res.redirect("/");
    });
  });

  // Debug endpoint
  app.get("/api/auth/status", (req, res) => {
    res.json({
      authenticated: req.isAuthenticated(),
      user: req.user || null,
      database: isDatabaseAvailable() ? 'connected' : 'memory-only',
      memoryUsers: memoryUsers.size,
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log(`[Auth] Unauthorized access attempt to ${req.path}`);
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Export memory users for other modules
export { memoryUsers };
