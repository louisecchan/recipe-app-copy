# Render Deployment Troubleshooting Guide

## Common Deployment Issues and Solutions

### Issue: "Exited with status 1"

This error typically occurs due to one of the following reasons:

## ✅ Checklist for Successful Deployment

### 1. **Environment Variables on Render**

Make sure you have set the following environment variables in your Render dashboard:

- `MONGO_URI` - Your MongoDB connection string (e.g., from MongoDB Atlas)
- `NODE_ENV` - Set to `production`
- `PORT` - Render automatically provides this, but you can set it if needed

**How to set environment variables on Render:**
1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Add each variable with its value
5. Save changes

### 2. **MongoDB Atlas Configuration**

Ensure your MongoDB Atlas is properly configured:

- ✅ Network Access: Add Render's IP addresses (or allow access from anywhere: `0.0.0.0/0`)
- ✅ Database User: Create a user with read/write permissions
- ✅ Connection String: Use the correct format with username and password

**MongoDB Atlas Network Access:**
1. Go to MongoDB Atlas dashboard
2. Click "Network Access" in the left sidebar
3. Click "Add IP Address"
4. Choose "Allow Access from Anywhere" (0.0.0.0/0)
5. Confirm

### 3. **Render Build Settings**

Ensure your Render service has the correct configuration:

**Build Command:**
```bash
yarn install
```

**Start Command:**
```bash
yarn start
```

**Root Directory:**
```
server
```

**Environment:**
- Node

**Branch:**
- main (or your deployment branch)

### 4. **package.json Scripts**

Verify your `server/package.json` has the correct scripts:

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

### 5. **MongoDB Connection Issues**

Common MongoDB connection problems:

**Problem:** `MongoNetworkError` or connection timeout
**Solution:** 
- Check if MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify connection string format
- Ensure database user credentials are correct

**Problem:** `Authentication failed`
**Solution:**
- Verify username and password in connection string
- Ensure special characters in password are URL-encoded
- Check database user has proper permissions

### 6. **Port Configuration**

The server is configured to use `process.env.PORT || 3001`. Render automatically sets the PORT environment variable, so this should work automatically.

### 7. **Static Files for Client**

The server serves the React build from `../client/build` in production. Ensure:
- The client build exists in the repo, OR
- You have a build step that builds the client before deploying

## 🔍 Debugging Steps

1. **Check Render Logs:**
   - Go to your Render dashboard
   - Click on your web service
   - View the "Logs" tab
   - Look for specific error messages

2. **Common Error Messages:**

   - **"Cannot find module"**: Missing dependency - run `yarn install`
   - **"MONGO_URI is undefined"**: Environment variable not set
   - **"MongoNetworkError"**: MongoDB Atlas network access issue
   - **"Authentication failed"**: Wrong MongoDB credentials

3. **Test Locally:**
   ```bash
   cd server
   NODE_ENV=production MONGO_URI="your_connection_string" yarn start
   ```

## 🚀 Deployment Steps

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Fix deployment configuration"
   git push origin main
   ```

2. **In Render Dashboard:**
   - Check environment variables are set
   - Verify build settings
   - Click "Manual Deploy" > "Deploy latest commit"

3. **Monitor the deployment:**
   - Watch the logs for any errors
   - Check the "Deploy" tab for build progress

## 📝 Environment Variables Template

Create these in your Render dashboard:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/recipe-app?retryWrites=true&w=majority
NODE_ENV=production
```

Replace:
- `username` - Your MongoDB user
- `password` - Your MongoDB password (URL encode special characters)
- `cluster.mongodb.net` - Your MongoDB cluster URL
- `recipe-app` - Your database name

## 🔐 URL Encoding Special Characters in Password

If your MongoDB password contains special characters, encode them:

| Character | Encoded |
|-----------|---------|
| @         | %40     |
| :         | %3A     |
| /         | %2F     |
| ?         | %3F     |
| #         | %23     |
| [         | %5B     |
| ]         | %5D     |
| !         | %21     |

Example:
- Password: `MyP@ssw0rd!`
- Encoded: `MyP%40ssw0rd%21`

## 📞 Need More Help?

If you're still having issues:
1. Check the Render deployment logs for specific errors
2. Verify MongoDB Atlas connection string
3. Test the connection locally first
4. Check if all dependencies are in package.json


