# 🚀 Render Deployment Checklist

## Pre-Deployment Checklist

### ☐ 1. MongoDB Atlas Setup
- [ ] MongoDB Atlas account created
- [ ] Database cluster is running
- [ ] Database user created with read/write permissions
- [ ] Network Access configured (IP whitelist: `0.0.0.0/0` to allow from anywhere)
- [ ] Connection string copied (Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

### ☐ 2. Code Repository
- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] All changes committed
- [ ] On the correct branch (usually `main` or `master`)

### ☐ 3. Render Account
- [ ] Render account created at https://render.com
- [ ] Connected to your Git repository

## Deployment Steps

### ☐ 4. Create New Web Service on Render

1. **Go to Render Dashboard**
   - Click "New +" button
   - Select "Web Service"

2. **Connect Repository**
   - Select your recipe-app repository
   - Click "Connect"

3. **Configure Service**
   
   **Name:** `recipe-app-server` (or any name you prefer)
   
   **Root Directory:** `server`
   
   **Environment:** `Node`
   
   **Region:** Choose closest to you
   
   **Branch:** `main`
   
   **Build Command:**
   ```bash
   yarn install
   ```
   
   **Start Command:**
   ```bash
   yarn start
   ```

4. **Set Environment Variables**
   
   Click "Advanced" and add these environment variables:
   
   | Key | Value | Required |
   |-----|-------|----------|
   | `MONGO_URI` | Your MongoDB connection string | ✅ YES |
   | `NODE_ENV` | `production` | ✅ YES |
   
   **Example MONGO_URI:**
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/recipe-app?retryWrites=true&w=majority
   ```
   
   **Important:** If your password has special characters, URL encode them:
   - `@` → `%40`
   - `:` → `%3A`
   - `/` → `%2F`
   - `?` → `%3F`
   - `#` → `%23`

5. **Create Web Service**
   - Review all settings
   - Click "Create Web Service"

### ☐ 5. Monitor Deployment

1. **Watch Build Logs**
   - Deployment will start automatically
   - Monitor logs for errors
   - Look for these success messages:
     - `🔄 Attempting to connect to MongoDB...`
     - `✅ MongoDB Connected Successfully!`
     - `🚀 Server is running on port XXXX`

2. **Check Health Endpoint**
   - Once deployed, visit: `https://your-app-name.onrender.com/health`
   - Should return:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-11-04T...",
     "environment": "production",
     "mongodb": "connected"
   }
   ```

### ☐ 6. Update Client CORS Settings (if needed)

If your client is deployed separately, update the CORS origin in `server/src/index.js`:

```javascript
cors({
  origin: [
    "http://localhost:3000",
    "https://recipe-app-copy.onrender.com",
    "https://your-actual-client-url.com"  // Add your client URL
  ],
  // ...
})
```

## Common Issues & Solutions

### ❌ Issue: "Exited with status 1"

**Possible Causes:**
1. Missing `MONGO_URI` environment variable
2. Incorrect MongoDB connection string
3. MongoDB Atlas network access not configured
4. Wrong build or start commands

**Solution Steps:**
1. Check Render logs for specific error message
2. Verify all environment variables are set
3. Confirm MongoDB Atlas IP whitelist includes `0.0.0.0/0`
4. Test connection string locally

### ❌ Issue: "MongoNetworkError" or Connection Timeout

**Solution:**
- Go to MongoDB Atlas → Network Access
- Add IP Address → Allow Access from Anywhere (`0.0.0.0/0`)
- Save and wait 2-3 minutes for changes to propagate

### ❌ Issue: "Authentication failed"

**Solution:**
- Verify MongoDB username and password
- Check if special characters are URL-encoded
- Confirm database user has proper permissions
- Try creating a new database user

### ❌ Issue: Build succeeds but app crashes

**Solution:**
- Check if `MONGO_URI` is set correctly
- Look for error messages in logs
- Verify `NODE_ENV=production` is set
- Check if the start command is correct

## Post-Deployment

### ☐ 7. Test Your Deployment

Test these endpoints:

1. **Health Check:**
   ```
   GET https://your-app-name.onrender.com/health
   ```

2. **Server Ready (only in development):**
   ```
   GET https://your-app-name.onrender.com/
   ```
   - In production, this serves the client build

3. **Register User:**
   ```
   POST https://your-app-name.onrender.com/auth/register
   Body: { "username": "testuser", "password": "testpass" }
   ```

4. **Get Recipes:**
   ```
   GET https://your-app-name.onrender.com/recipes
   ```

### ☐ 8. Configure Custom Domain (Optional)

1. Go to your Render service settings
2. Click "Custom Domain"
3. Follow instructions to add your domain
4. Update DNS records as instructed

## 🎉 Deployment Complete!

Your app should now be live at:
```
https://your-app-name.onrender.com
```

## Need Help?

1. **Check Render Logs:** Most errors are visible in deployment logs
2. **Review this guide:** See `RENDER_DEPLOYMENT_GUIDE.md` for detailed troubleshooting
3. **Test locally first:** Ensure everything works locally before deploying
4. **MongoDB Atlas:** Verify connection from your local machine first

## Quick Local Test

Before deploying, test with production environment:

```bash
cd server
NODE_ENV=production MONGO_URI="your_connection_string" yarn start
```

If this works locally, it should work on Render (assuming environment variables are set correctly).


