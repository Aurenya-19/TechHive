# 🚨 Fix Deployment Error NOW

## The error you're seeing is likely one of these:

### 1. Missing Environment Variables (Most Common)

**Fix in 2 minutes:**

Go to your deployment platform (Render/Vercel) → Settings → Environment Variables

Add these:

```
DATABASE_URL=postgresql://your-neon-url
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_CALLBACK_URL=https://your-domain.com/api/callback
SESSION_SECRET=any-random-32-character-string-here
NODE_ENV=production
```

**Generate SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then **redeploy**.

---

### 2. Database Endpoint Disabled

**Fix in 1 minute:**

1. Go to https://console.neon.tech
2. Select your project
3. Click "Compute" tab
4. Click "Enable" on your endpoint
5. Redeploy

---

### 3. Wrong Callback URL

**Fix in 30 seconds:**

Your `GOOGLE_CALLBACK_URL` must match your actual domain:

```
# If deployed on Render:
GOOGLE_CALLBACK_URL=https://your-app.onrender.com/api/callback

# If deployed on Vercel:
GOOGLE_CALLBACK_URL=https://your-app.vercel.app/api/callback

# NOT localhost!
```

Also update this in Google Cloud Console:
1. Go to https://console.cloud.google.com
2. APIs & Services → Credentials
3. Edit your OAuth 2.0 Client
4. Add your production URL to "Authorized redirect URIs"

---

### 4. Build Cache Issue

**Fix in 1 minute:**

In your deployment platform:
1. Settings → Clear Build Cache
2. Trigger new deployment

---

## Quick Diagnostic

Run this locally to find the exact issue:

```bash
node diagnose.js
```

This will tell you exactly what's wrong.

---

## Still Broken?

### Check Logs

**Render:**
1. Go to your service
2. Click "Logs" tab
3. Look for error messages

**Vercel:**
1. Go to your deployment
2. Click "Functions" tab
3. Look for error logs

### Common Error Messages

**"endpoint is disabled"**
→ Fix #2 above (Enable database endpoint)

**"invalid client"**
→ Fix #3 above (Wrong callback URL)

**"Cannot find module"**
→ Clear build cache (Fix #4)

**"undefined is not a function"**
→ Missing environment variables (Fix #1)

---

## Emergency: Rollback

If completely broken, rollback to last working version:

**Render:**
1. Deployments tab
2. Find last successful deployment
3. Click "Redeploy"

**Vercel:**
1. Deployments tab
2. Find last successful deployment  
3. Click "Promote to Production"

---

## Need More Help?

1. Read `DEPLOYMENT_FIX.md` for detailed guide
2. Run `node diagnose.js` for specific issues
3. Check deployment logs for error messages

---

## Most Likely Fix

**90% of deployment errors are from missing environment variables.**

Double-check all 5 required variables are set:
- ✅ DATABASE_URL
- ✅ GOOGLE_CLIENT_ID
- ✅ GOOGLE_CLIENT_SECRET
- ✅ GOOGLE_CALLBACK_URL
- ✅ SESSION_SECRET

Then redeploy. Should work! 🎉
