# 🔧 Quick Fix Guide - Render Deployment Failed

## Your deployment failed with "Exited with status 1"

### ⚡ Most Common Fix (Works 80% of the time)

**The Problem:** Missing `MONGO_URI` environment variable

**The Solution:**
1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your web service
3. Click "Environment" tab in the left sidebar
4. Add this environment variable:
   - **Key:** `MONGO_URI`
   - **Value:** Your MongoDB connection string (see below)
5. Click "Save Changes"
6. Your app will automatically redeploy

---

## 📝 Getting Your MongoDB Connection String

### If you're using MongoDB Atlas:

1. Go to https://cloud.mongodb.com
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/recipe-app?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your actual credentials
6. **IMPORTANT:** If your password has special characters, encode them:
   - Example: Password `P@ss!` becomes `P%40ss%21`

### Special Character Encoding Table:
| Character | Replace with |
|-----------|--------------|
| @         | %40          |
| !         | %21          |
| #         | %23          |
| $         | %24          |
| %         | %25          |
| ^         | %5E          |
| &         | %26          |
| *         | %2A          |

---

## 🔒 MongoDB Atlas Network Access

**Another common issue:** MongoDB blocking connections from Render

**The Fix:**
1. Go to MongoDB Atlas dashboard
2. Click "Network Access" (left sidebar)
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere"
5. Confirm by clicking "0.0.0.0/0"
6. Click "Confirm"
7. Wait 2-3 minutes for changes to take effect
8. Go back to Render and click "Manual Deploy"

---

## ✅ Checklist - Did you do all of these?

- [ ] **MONGO_URI** is set in Render environment variables
- [ ] **NODE_ENV** is set to `production` in Render
- [ ] MongoDB Atlas allows connections from `0.0.0.0/0`
- [ ] Your MongoDB username and password are correct
- [ ] Special characters in password are URL-encoded
- [ ] Your MongoDB user has read/write permissions
- [ ] Build Command is set to: `yarn install`
- [ ] Start Command is set to: `yarn start`
- [ ] Root Directory is set to: `server`

---

## 🔍 How to Read Render Logs

1. Go to your Render service dashboard
2. Click "Logs" tab
3. Look for these specific errors:

### Error: "MONGO_URI environment variable is not defined"
**Fix:** Add MONGO_URI in environment variables (see above)

### Error: "MongoNetworkError" or "connection timeout"
**Fix:** Allow connections from anywhere in MongoDB Atlas Network Access

### Error: "Authentication failed"
**Fix:** Check username/password and URL-encode special characters

### Error: "Cannot find module"
**Fix:** Make sure Build Command is `yarn install` and it completed successfully

---

## 🚀 After Fixing

1. Save your environment variable changes in Render
2. Render will auto-deploy, OR
3. Click "Manual Deploy" → "Deploy latest commit"
4. Monitor the logs
5. Look for these success messages:
   - ✅ MongoDB Connected Successfully!
   - 🚀 Server is running on port XXXX

---

## 🆘 Still Not Working?

### Test your MongoDB connection locally:

```bash
cd server
MONGO_URI="your_connection_string" NODE_ENV=production yarn start
```

If it fails locally with the same error, the problem is with your MongoDB setup, not Render.

If it works locally but fails on Render, double-check your Render environment variables.

---

## 📚 Need More Help?

- **Detailed Guide:** See `DEPLOYMENT_CHECKLIST.md`
- **Full Troubleshooting:** See `RENDER_DEPLOYMENT_GUIDE.md`
- **Render Support:** https://render.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com

---

## 💡 Pro Tip

Test your MongoDB connection string in your terminal first:

```bash
# Install mongosh (MongoDB Shell)
brew install mongosh  # macOS
# or download from: https://www.mongodb.com/try/download/shell

# Test connection
mongosh "your_connection_string"
```

If this connects successfully, your connection string is correct!


