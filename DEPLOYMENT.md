# WizPay Deployment Guide

## Pre-Deployment Commands (Run Every Time)

### 1. Build and Deploy Script
```bash
# From project root directory
npm run deploy
```

This command:
- Builds the React app with production optimizations
- Copies build files to backend/static/ folder

### 2. Manual Steps (Alternative)
```bash
# Build React app
npm run build

# Copy build to backend
cp -r build/* backend/static/
```

## Render Deployment Instructions

### Initial Setup

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production build ready"
   git push origin main
   ```

2. **Create New Web Service on Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `wizpay-criscross`

3. **Configure Build Settings**
   - **Name**: `wizpay-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

4. **Environment Variables**
   Add these in Render dashboard:
   ```
   NODE_ENV=production
   PORT=5001
   HOST=0.0.0.0
   ```

5. **Advanced Settings**
   - **Auto-Deploy**: Yes (deploys on git push)
   - **Health Check Path**: `/` (optional)

### Deployment Checklist

Before each deployment:
- [ ] Run `npm run deploy` to build and copy files
- [ ] Test locally: `npm run start:server`
- [ ] Commit and push changes to GitHub
- [ ] Render will auto-deploy (if enabled)

### Manual Deployment Trigger
If auto-deploy is disabled:
1. Go to Render dashboard
2. Find your service
3. Click "Manual Deploy" → "Deploy latest commit"

### Post-Deployment
- Service will be available at: `https://your-service-name.onrender.com`
- Both frontend and API accessible from same URL
- API endpoints: `/api/deposit`, `/api/withdraw`

## Local Testing Before Deploy
```bash
# Test the full production setup locally
npm run deploy
npm run start:server
# Visit: http://localhost:5001
```

## Troubleshooting
- **Build fails**: Check `npm run build` works locally
- **Static files not served**: Ensure `backend/static/` has build files
- **API not working**: Check CORS settings in server.js
- **WebSocket errors**: Should be fixed with GENERATE_SOURCEMAP=false
