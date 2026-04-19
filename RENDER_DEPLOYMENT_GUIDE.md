# 🚀 Deploying TalentFlow AI to Render

Yes! You can absolutely host TalentFlow AI on Render. Here's the complete guide.

## 📋 What You'll Need

1. **Render Account** - Sign up at https://render.com (free tier available)
2. **GitHub Repository** - Push your code to GitHub
3. **MongoDB Atlas** - Already set up ✅
4. **Environment Variables** - Configure them in Render

---

## 🔧 Step 1: Prepare Your Code for Render

### Backend Configuration (Already Updated ✅)
Your `application.properties` now uses environment variables:
- `PORT` - Dynamic port assignment
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Security key
- `CORS_ORIGINS` - Frontend URL

### Create Build Configuration Files

#### **A. Create `Procfile` (in root directory)**

```
web: cd backend && ./mvnw package -DskipTests && java -Dserver.port=$PORT -jar target/talentflow-api-*.jar
```

#### **B. Create `render.yaml` (Optional but Recommended)**

This file in your root directory defines your services:

```yaml
services:
  - type: web
    name: talentflow-backend
    env: java
    buildCommand: "cd backend && ./mvnw clean package -DskipTests"
    startCommand: "java -Dserver.port=$PORT -jar target/talentflow-api-*.jar"
    plan: free
    envVars:
      - key: MONGODB_URI
        scope: run
      - key: JWT_SECRET
        scope: run
      - key: CORS_ORIGINS
        scope: run

  - type: static
    name: talentflow-frontend
    staticPublishPath: frontend/dist
    buildCommand: "cd frontend && npm install && npm run build"
    routes:
      - path: /*
        destination: /index.html
```

---

## 🚀 Step 2: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Render deployment"

# Add GitHub remote and push
git remote add origin https://github.com/YOUR_USERNAME/talentflow-ai.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 3: Deploy Backend on Render

1. **Log in to Render** - https://dashboard.render.com
2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repo: `talentflow-ai`
   - Branch: `main`

3. **Configure Service**
   - **Name**: `talentflow-backend`
   - **Environment**: `Docker` or `Node` (for Java use Docker)
   - **Build Command**: `cd backend && ./mvnw clean package -DskipTests`
   - **Start Command**: `java -Dserver.port=$PORT -jar target/talentflow-api-*.jar`
   - **Plan**: Free (starts at $0/month, pauses after 15 min inactivity) or Paid for always-on

4. **Add Environment Variables** (in Render dashboard)

   Click "Advanced" and add these:
   
   ```
   MONGODB_URI=mongodb+srv://REDACTED@REDACTED_CLUSTER.mrrc1c2.mongodb.net/talentflow?retryWrites=true&w=majority&authSource=admin
   
   JWT_SECRET=REDACTED_JWT_SECRET-production-minimum-32-characters-required-for-hs256
   
   CORS_ORIGINS=https://talentflow-frontend.onrender.com
   ```

5. **Deploy** - Click "Create Web Service"

6. **Get Backend URL**
   - Once deployed, you'll get a URL like: `https://talentflow-backend.onrender.com`
   - Copy this - you'll need it for the frontend

---

## 🎨 Step 4: Deploy Frontend on Render

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect your GitHub repo

2. **Configure Service**
   - **Name**: `talentflow-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

3. **Update API URL**
   
   Before deployment, update your frontend API configuration:
   
   **File**: `frontend/src/services/api.js`
   
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://talentflow-backend.onrender.com/api';
   ```

4. **Deploy** - Click "Create Static Site"

5. **Get Frontend URL**
   - You'll get a URL like: `https://talentflow-frontend.onrender.com`

---

## ⚙️ Step 5: Update CORS on Backend

Update the backend's CORS origins to allow your frontend:

1. Go to your backend service in Render
2. Go to "Environment"
3. Update `CORS_ORIGINS`:
   ```
   https://talentflow-frontend.onrender.com,http://localhost:3000,http://localhost:3001
   ```
4. Redeploy backend

---

## 📝 Step 6: Update Frontend API Calls

Update `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://talentflow-backend.onrender.com/api'
    : 'http://localhost:8081/api');
```

---

## ✅ Step 7: MongoDB Atlas IP Whitelist

**Important!** Make sure your MongoDB Atlas Network Access allows Render IPs:

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Click "Network Access" → "IP Access List"
3. Add IP: `0.0.0.0/0` (allows all IPs, safe for development)
   - Or be more restrictive and add Render's IP range

---

## 🧪 Step 8: Test Deployment

Once both services are deployed:

1. Visit frontend: `https://talentflow-frontend.onrender.com`
2. Try to signup/login
3. Check backend logs in Render dashboard if there are errors

---

## 📊 Typical Render Deployment Flow

```
┌─────────────────────────────────────────┐
│     GitHub Repository (main branch)     │
│  - /backend (Spring Boot + Maven)       │
│  - /frontend (React + Vite)             │
│  - render.yaml (Optional)               │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
   ┌────────────┐  ┌──────────────┐
   │  Backend   │  │  Frontend    │
   │  Service   │  │  Static Site │
   │(Java/Maven)│  │(React/Vite)  │
   └────────────┘  └──────────────┘
       │                │
       │ API Calls ◄────┘
       │
       ▼
  ┌──────────────┐
  │ MongoDB Atlas│
  └──────────────┘
```

---

## 💰 Cost Estimate

| Service | Render Plan | Cost/Month |
|---------|------------|-----------|
| Backend | Free Tier | $0 (pauses after 15 min) |
| Backend | Starter | $7 (always running) |
| Frontend | Static Site | $0 |
| MongoDB | Atlas Free | $0 |
| **Total** | **Free Tier** | **$0** |

---

## 🚨 Common Issues & Solutions

### Issue: "Port Already in Use"
**Solution**: Render automatically assigns the PORT environment variable. Your app.properties now uses `${PORT:8081}` ✅

### Issue: "CORS Error"
**Solution**: Update `CORS_ORIGINS` environment variable with your frontend URL

### Issue: "MongoDB Connection Fails"
**Solution**: 
1. Check MongoDB Atlas IP whitelist
2. Verify `MONGODB_URI` environment variable is correct
3. Check credentials in connection string

### Issue: "Frontend can't reach backend"
**Solution**: 
1. Update `API_BASE_URL` to your backend URL
2. Check CORS configuration on backend
3. Ensure backend is deployed and running

### Issue: "Free tier app keeps stopping"
**Solution**: Upgrade to Starter plan ($7/month) for always-on service

---

## 🔄 Continuous Deployment

Once connected to GitHub, Render will:
1. Automatically deploy when you push to `main` branch
2. Run your build commands
3. Restart your services
4. Keep environment variables safe

**Workflow**:
```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main
# Render automatically deploys!
```

---

## 📱 Quick Deploy Checklist

- [ ] Push code to GitHub
- [ ] Create backend Web Service on Render
- [ ] Add environment variables to backend
- [ ] Create frontend Static Site on Render
- [ ] Update API_BASE_URL in frontend
- [ ] Test signup/login flow
- [ ] Monitor logs for errors
- [ ] Share your deployed URL!

---

## 🎉 Final Result

Once deployed:
- **Frontend**: `https://talentflow-frontend.onrender.com`
- **Backend API**: `https://talentflow-backend.onrender.com/api`
- **Database**: MongoDB Atlas (cloud)

Your TalentFlow AI job portal is now live! 🚀

---

## 📞 Render Resources

- **Docs**: https://render.com/docs
- **Java Deployment**: https://render.com/docs/deploy-java
- **Static Sites**: https://render.com/docs/static-sites
- **Environment Variables**: https://render.com/docs/configure-environment-variables

---

**Good luck with your deployment!** If you run into issues, check the Render logs in the dashboard for detailed error messages.
