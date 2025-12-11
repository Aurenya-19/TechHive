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
  try {
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value;
    const firstName = profile.name?.givenName || '';
    const lastName = profile.name?.familyName || '';
    const profileImageUrl = profile.photos?.[0]?.value;

    // Validate required fields
    if (!email) {
      throw new Error('Email is required from Google profile');
    }

    // Check if user already exists by email to prevent duplicate key violations
    let existingUser = null;
    try {
      const result = await storage.getUserByEmail(email);
      existingUser = result;
    } catch (err) {
      console.log(`[Auth] User ${email} not found, will create new user`);
    }

    // Use existing user ID if found, otherwise use Google ID
    const userId = existingUser?.id || googleId;

    const upsertedUser = await storage.upsertUser({
      id: userId,
      email,
      firstName,
      lastName,
      profileImageUrl,
    });

    console.log(`[Auth] User upserted successfully: ${email}`);
    return upsertedUser;
  } catch (error: any) {
    console.error(`[Auth] Error upserting user:`, error);
    throw new Error(`Failed to create/update user: ${error.message}`);
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
  try {
    app.set("trust proxy", 1);
    app.use(getSession());
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
    console.log(`[Auth] DATABASE_URL loaded: ${process.env.DATABASE_URL ? 'YES' : 'NO'}`);
    console.log(`[Auth] SESSION_SECRET loaded: ${process.env.SESSION_SECRET ? 'YES' : 'NO'}`);
    
    if (!clientID || !clientSecret) {
      console.error('[Auth] ERROR: Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
      throw new Error('Google OAuth credentials not found in environment');
    }

    if (!process.env.DATABASE_URL) {
      console.error('[Auth] ERROR: Missing DATABASE_URL');
      throw new Error('DATABASE_URL not found in environment');
    }

    if (!process.env.SESSION_SECRET) {
      console.error('[Auth] ERROR: Missing SESSION_SECRET');
      throw new Error('SESSION_SECRET not found in environment');
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
            await upsertUser(profile);
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

    passport.serializeUser((user: any, cb) => {
      console.log(`[Auth] Serializing user: ${user.email}`);
      cb(null, user);
    });
    
    passport.deserializeUser((user: any, cb) => {
      console.log(`[Auth] Deserializing user: ${user.email}`);
      cb(null, user);
    });

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
          return res.redirect(`/?auth=failed&error=${encodeURIComponent(req.query.error as string)}`);
        }
        next();
      },
      passport.authenticate("google", {
        failureRedirect: "/?auth=failed",
      }),
      (req, res) => {
        console.log(`[Auth] Successful Google login for user: ${(req.user as any)?.email}`);
        res.redirect("/");
      }
    );

    app.get("/api/logout", (req, res) => {
      const userEmail = (req.user as any)?.email;
      req.logout((err) => {
        if (err) {
          console.error(`[Auth] Logout error for ${userEmail}:`, err);
          return res.status(500).json({ error: err.message });
        }
        console.log(`[Auth] User logged out: ${userEmail}`);
        res.redirect("/");
      });
    });

    console.log('[Auth] Google OAuth setup completed successfully');
  } catch (error: any) {
    console.error('[Auth] FATAL: Failed to setup authentication:', error);
    throw error;
  }
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log(`[Auth] Unauthorized access attempt to ${req.path}`);
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
