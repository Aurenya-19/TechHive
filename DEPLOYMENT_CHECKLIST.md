# CodeVerse Deployment Checklist

## Pre-Deployment

### 1. Environment Variables (Render)

Ensure all required environment variables are set in Render dashboard:

#### Required Variables
- [ ] `DATABASE_URL` - Your Neon PostgreSQL connection string
- [ ] `SESSION_SECRET` - Random string for session encryption (generate with `openssl rand -base64 32`)
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `NODE_ENV` - Set to `production`

#### Optional Variables
- [ ] `GOOGLE_CALLBACK_URL` - Override callback URL (default: auto-detected)
- [ ] `PUBLIC_URL` - Your Render app URL (e.g., `codeverse-4za9.onrender.com`)
- [ ] `PORT` - Port number (Render sets this automatically)

### 2. Google OAuth Configuration

1. **Google Cloud Console** (https://console.cloud.google.com)
   - [ ] Create or select a project
   - [ ] Enable Google+ API
   - [ ] Create OAuth 2.0 credentials
   - [ ] Add authorized redirect URIs:
     - `https://your-app.onrender.com/api/callback`
     - `http://localhost:5000/api/callback` (for local testing)

2. **Copy Credentials**
   - [ ] Copy Client ID to `GOOGLE_CLIENT_ID`
   - [ ] Copy Client Secret to `GOOGLE_CLIENT_SECRET`

### 3. Neon Database Setup

1. **Create Database** (https://console.neon.tech)
   - [ ] Create a new project or use existing
   - [ ] Note the connection string
   - [ ] Ensure compute endpoint is **enabled** (not suspended)

2. **Configure Connection**
   - [ ] Copy connection string to `DATABASE_URL`
   - [ ] Verify connection string includes `?sslmode=require`
   - [ ] Test connection locally

3. **Database Settings**
   - [ ] Set auto-suspend delay (recommend: disabled for production)
   - [ ] Configure compute size based on expected load
   - [ ] Enable connection pooling if needed

### 4. Render Service Configuration

1. **Service Settings**
   - [ ] Build Command: `npm run build`
   - [ ] Start Command: `npm start`
   - [ ] Node Version: 20.x or higher
   - [ ] Region: Choose closest to your users

2. **Advanced Settings**
   - [ ] Health Check Path: `/health`
   - [ ] Auto-Deploy: Enable (deploys on git push)
   - [ ] Instance Type: Choose based on traffic

## Deployment Steps

### 1. Initial Deployment

```bash
# 1. Commit all changes
git add .
git commit -m "Production deployment"
git push origin main

# 2. Render will auto-deploy if connected to GitHub
# Or manually deploy via Render dashboard
```

### 2. Verify Deployment

1. **Check Build Logs**
   - [ ] No build errors
   - [ ] Dependencies installed successfully
   - [ ] TypeScript compilation successful

2. **Check Runtime Logs**
   - [ ] Server starts without errors
   - [ ] Database connection successful
   - [ ] OAuth configured correctly
   - [ ] Look for: `CodeVerse server running on port XXXX`

3. **Test Health Endpoint**
   ```bash
   curl https://your-app.onrender.com/health
   ```
   - [ ] Returns 200 status
   - [ ] `database: "healthy"`
   - [ ] `status: "healthy"`

4. **Test OAuth Login**
   - [ ] Visit your app
   - [ ] Click "Login with Google"
   - [ ] Redirects to Google
   - [ ] Redirects back successfully
   - [ ] User is logged in

### 3. Database Migration

```bash
# Run migrations (if needed)
npm run db:push
```

- [ ] Tables created successfully
- [ ] Seed data loaded (if applicable)
- [ ] No migration errors

## Post-Deployment

### 1. Monitoring Setup

1. **Uptime Monitoring**
   - [ ] Set up UptimeRobot or similar
   - [ ] Monitor `/health` endpoint
   - [ ] Alert on downtime

2. **Error Tracking**
   - [ ] Review Render logs regularly
   - [ ] Set up log alerts for errors
   - [ ] Monitor database connection errors

3. **Performance Monitoring**
   - [ ] Check response times
   - [ ] Monitor database query performance
   - [ ] Track memory usage

### 2. Security Checklist

- [ ] HTTPS enabled (automatic on Render)
- [ ] Session secret is strong and unique
- [ ] OAuth credentials are secure
- [ ] Database credentials are secure
- [ ] Rate limiting is active
- [ ] CORS configured properly
- [ ] No sensitive data in logs

### 3. Performance Optimization

- [ ] Compression enabled (gzip)
- [ ] Caching headers configured
- [ ] Database connection pooling active
- [ ] Static assets served efficiently
- [ ] CDN configured (if needed)

## Troubleshooting

### Common Issues

#### 1. OAuth 500 Error
**Symptom**: Login fails with 500 error

**Solutions**:
- [ ] Check Neon database endpoint is enabled
- [ ] Verify `DATABASE_URL` is correct
- [ ] Check Google OAuth credentials
- [ ] Review logs for specific error
- [ ] See `NEON_DATABASE_FIX.md` for detailed guide

#### 2. Database Connection Timeout
**Symptom**: Slow responses or timeouts

**Solutions**:
- [ ] Check Neon endpoint status
- [ ] Verify connection pool settings
- [ ] Increase timeout values if needed
- [ ] Check network connectivity

#### 3. Session Issues
**Symptom**: Users logged out unexpectedly

**Solutions**:
- [ ] Verify `SESSION_SECRET` is set
- [ ] Check database session store
- [ ] Review session cookie settings
- [ ] Check for database connection issues

#### 4. Build Failures
**Symptom**: Deployment fails during build

**Solutions**:
- [ ] Check build logs for errors
- [ ] Verify all dependencies in package.json
- [ ] Ensure Node version compatibility
- [ ] Clear build cache and retry

## Maintenance

### Regular Tasks

**Daily**
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review performance metrics

**Weekly**
- [ ] Review database usage
- [ ] Check for security updates
- [ ] Monitor resource usage

**Monthly**
- [ ] Update dependencies
- [ ] Review and optimize queries
- [ ] Backup database
- [ ] Review access logs

### Scaling Considerations

**When to Scale Up**:
- Response times > 1 second
- CPU usage consistently > 80%
- Memory usage > 90%
- Database connections maxed out
- Frequent rate limit hits

**Scaling Options**:
1. **Vertical Scaling**
   - Upgrade Render instance type
   - Increase Neon compute size
   - Increase connection pool size

2. **Horizontal Scaling**
   - Add more Render instances
   - Enable Render auto-scaling
   - Use read replicas for database

3. **Optimization**
   - Add Redis for caching
   - Optimize database queries
   - Implement CDN for static assets
   - Add database indexes

## Emergency Procedures

### Database Down
1. Check Neon dashboard for status
2. Enable endpoint if suspended
3. Verify connection string
4. Restart Render service
5. Monitor health endpoint

### OAuth Broken
1. Verify Google OAuth credentials
2. Check authorized redirect URIs
3. Review environment variables
4. Check Render logs for errors
5. Test with fresh browser session

### High Traffic
1. Monitor Render metrics
2. Check rate limiting effectiveness
3. Review database performance
4. Consider scaling up
5. Enable caching if not already

## Success Criteria

Deployment is successful when:
- [ ] Health endpoint returns healthy status
- [ ] Users can log in with Google
- [ ] Database operations work correctly
- [ ] No errors in logs
- [ ] Response times < 500ms
- [ ] Uptime > 99.9%

## Support Resources

- **Render Docs**: https://render.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
- **Project Issues**: https://github.com/Aurenya-19/CodeVerse/issues

---

**Last Updated**: December 11, 2025
**Version**: 1.0
