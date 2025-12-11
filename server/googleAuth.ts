import passport from "passport";
import type { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GoogleOAuthStrategy } from "passport-google-oauth20";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  // Handle session store errors gracefully
  sessionStore.on("error", (err) => {
    console.error("[Session] Store error:", err.message);
  });
  
  return session({
    secret: process.env.SESSION_SECRET!,
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
}

async function upsertUser(profile: any) {
  const googleId = profile.id;
  const email = profile.emails?.[0]?.value;
  const firstName = profile.name?.givenName || '';
  const lastName = profile.name?.familyName || '';
  const profileImageUrl = profile.photos?.[0]?.value;

  try {
    // Check if user already exists by email to prevent duplicate key violations
    let existingUser = null;
    if (email) {
      try {
        const result = await storage.getUserByEmail(email);
        existingUser = result;
      } catch (err: any) {
        // User doesn't exist or database error
        if (!err.message?.includes("endpoint") && !err.message?.includes("disabled")) {
          console.log("[Auth] User lookup failed (likely doesn't exist):", err.message);
        }
      }
    }

    // Use existing user ID if found, otherwise use Google ID
    const userId = existingUser?.id || googleId;

    await storage.upsertUser({
      id: userId,
      email,
      firstName,
      lastName,
      profileImageUrl,
    });
    
    console.log(`[Auth] User upserted successfully: ${email}`);
  } catch (err: any) {
    console.error("[Auth] Error upserting user:", err.message);
    
    // Check for database endpoint disabled error
    if (err.message?.includes("endpoint") && err.message?.includes("disabled")) {
      throw new Error("Database is currently unavailable. Please try again later or contact support.");
    }
    
    throw err;
  }
}

// Helper function to get callback URL from request
function getCallbackURL(req?: any): string {
  if (process.env.NODE_ENV === 'production') {
    // Try explicit config first
    if (process.env.GOOGLE_CALLBACK_URL) {
      return process.env.GOOGLE_CALLBACK_URL;
    }
    // Try PUBLIC_URL env var
    if (process.env.PUBLIC_URL) {
      return `https://${process.env.PUBLIC_URL}/api/callback`;
    }
    // Try to get from request host (Render sends this)
    if (req && req.get) {
      const host = req.get('host');
      if (host && !host.includes('localhost')) {
        return `https://${host}/api/callback`;
      }
    }
    // Fallback for Render deployment
    return 'https://codeverse-4za9.onrender.com/api/callback';
  } else {
    // Development
    return `http://localhost:5000/api/callback`;
  }
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  
  try {
    app.use(getSession());
  } catch (err: any) {
    console.error("[Auth] Session setup error:", err.message);
    console.error("[Auth] Continuing with in-memory sessions (not recommended for production)");
    
    // Fallback to memory store if database session fails
    const MemoryStore = require("memorystore")(session);
    app.use(session({
      secret: process.env.SESSION_SECRET!,
      store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    }));
  }
  
  app.use(passport.initialize());
  app.use(passport.session());

  // Get initial callback URL for logging
  const initialCallbackURL = getCallbackURL();
  console.log(`[Auth] Google OAuth configured with callback URL: ${initialCallbackURL}`);

  // Ensure we have credentials
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  console.log(`[Auth] GOOGLE_CLIENT_ID loaded: ${clientID ? 'YES (' + clientID.substring(0, 20) + '...)' : 'NO'}`);
  console.log(`[Auth] GOOGLE_CLIENT_SECRET loaded: ${clientSecret ? 'YES' : 'NO'}`);
  
  if (!clientID || !clientSecret) {
    console.error('[Auth] ERROR: Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
    throw new Error('Google OAuth credentials not found in environment');
  }

  // Google OAuth Strategy - use dynamic callback URL
  passport.use(
    new GoogleOAuthStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: initialCallbackURL,
        passReqToCallback: true,
      },
      async (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          console.log(`[Auth] Google OAuth callback received for: ${profile.emails?.[0]?.value}`);
          
          // Try to upsert user with error handling
          try {
            await upsertUser(profile);
          } catch (dbErr: any) {
            console.error(`[Auth] Database error during user upsert:`, dbErr.message);
            
            // Return error with user-friendly message
            if (dbErr.message?.includes("Database is currently unavailable")) {
              return done(new Error("Our database is temporarily unavailable. Please try again in a few minutes."));
            }
            
            // For other errors, still allow login but log the issue
            console.error(`[Auth] Continuing with login despite database error`);
          }
          
          return done(null, {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            profile,
          });
        } catch (error: any) {
          console.error(`[Auth] Error in Google OAuth callback:`, error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, cb) => cb(null, user));
  passport.deserializeUser((user: any, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    console.log(`[Auth] Login request from: ${req.hostname} - Callback will be: ${initialCallbackURL}`);
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  });

  app.get(
    "/api/callback",
    (req, res, next) => {
      console.log(`[Auth] Callback received with query:`, req.query);
      if (req.query.error) {
        console.error(`[Auth] Google OAuth error: ${req.query.error} - ${req.query.error_description}`);
      }
      next();
    },
    (req, res, next) => {
      passport.authenticate("google", {
        failureRedirect: "/?auth=failed",
      })(req, res, (err) => {
        if (err) {
          console.error(`[Auth] Authentication error:`, err.message);
          
          // Handle database errors gracefully
          if (err.message?.includes("database") || err.message?.includes("Database")) {
            return res.redirect("/?auth=db_error");
          }
          
          return res.redirect("/?auth=failed");
        }
        next();
      });
    },
    (req, res) => {
      console.log(`[Auth] Successful Google login for user: ${(req.user as any)?.email}`);
      res.redirect("/");
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("[Auth] Logout error:", err.message);
        return res.status(500).json({ error: "Logout failed" });
      }
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
