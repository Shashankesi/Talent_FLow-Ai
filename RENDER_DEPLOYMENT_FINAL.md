# 🚀 RENDER DEPLOYMENT GUIDE - TalentFlow AI

## 🎯 Quick Summary

**Problem**: Render detects project as Node.js instead of Java  
**Root Cause**: No explicit Java configuration; Node detection happens first  
**Solution**: Use manual backend deployment + static frontend

**Estimated Time**: 20 minutes total

---

## ✅ PREREQUISITE CHECKLIST

Before starting, verify:

- [ ] GitHub account created
- [ ] Repository pushed to: `https://github.com/Shashankesi/Talent_FLow-Ai`
- [ ] Render.com account created
- [ ] MongoDB Atlas credentials ready
- [ ] JWT secret generated: `openssl rand -base64 32`

---

## 🔴 WHY "mvn: command not found"?

### Root Cause
Render detects your project language by:
1. **First**: Looking for `pom.xml` in root directory (❌ Not there)
2. **Then**: Looking for `package.json` in root directory (✅ Frontend's exists)
3. **Result**: Defaults to **Node.js runtime**
4. **Error**: Node.js runtime doesn't have Maven, so `mvn` fails

### Why Project Structure Matters
```
❌ WRONG (causes Node detection):
TalentFlow-AI/
  ├── pom.xml (frontend)
  ├── package.json (at root!)
  └── src/

✅ CORRECT (forces Java detection):
TalentFlow-AI/
  ├── backend/
  │   └── pom.xml ← Maven finds this
  ├── frontend/
  │   └── package.json ← Ignored for backend
  └── Procfile ← Explicitly tells Render it's Java
```

---

## 📋 SOLUTION: Two-Service Approach

### Why Two Services?
- **Backend Service**: Java web service
- **Frontend Service**: Static site (optimized for React)

This is the best practice for full-stack apps on Render.

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### PHASE 1: Deploy Backend (Java Service)

#### Step 1.1: Go to Render Dashboard
1. Visit https://render.com/dashboard
2. Click **New+** dropdown (top-right)
3. Select **Web Service**

#### Step 1.2: Connect GitHub Repository
1. Click **Build and deploy from a Git repository**
2. Click **Connect account** (if needed)
3. **Find and select**: `Talent_FLow-Ai`
4. Choose **branch**: `main`
5. Click **Connect**

#### Step 1.3: Configure Backend Service

You'll see a form. Fill it like this:

```
┌─────────────────────────────────────────────┐
│ SERVICE INFORMATION                         │
├─────────────────────────────────────────────┤
│ Name:                 talentflow-backend    │
│ Root Directory:       backend               │ ← CRITICAL!
│ Environment:          Java                  │ ← Select from dropdown
│ Java Version:         Java 21               │
│ Build Command:        mvn clean package     │
│                       -DskipTests           │
│ Start Command:        java -jar             │
│                       target/talentflow-api-1.0.0.jar
│                                             │
│ Instance Type:        Free                  │
│ Plan:                 Free                  │
│ Autodeployment:       Enable (default)      │
└─────────────────────────────────────────────┘
```

**⚠️ CRITICAL FIELDS**:
- **Root Directory**: MUST be `backend` (not blank!)
- **Environment**: MUST be `Java` (click dropdown)
- **Build Command**: `mvn clean package -DskipTests`
- **Start Command**: `java -jar target/talentflow-api-1.0.0.jar`

#### Step 1.4: Add Environment Variables

1. Scroll down to **Environment** section
2. Click **Add Environment Variable** (+ button)

Add **THREE** variables:

```
Variable 1:
  Key:   SPRING_DATA_MONGODB_URI
  Value: mongodb+srv://username:password@cluster.mongodb.net/talentflow?retryWrites=true&w=majority&authSource=admin
  
Variable 2:
  Key:   JWT_SECRET
  Value: [Paste your generated secret: openssl rand -base64 32]
  
Variable 3:
  Key:   CORS_ORIGINS
  Value: http://localhost:3000
         (Update this after frontend is deployed)
```

#### Step 1.5: Deploy Backend

1. Click **Create Web Service**
2. **Wait 3-5 minutes** for:
   - Maven build to complete
   - JAR file to be created
   - Java application to start

3. **Copy the URL** that appears (format: `https://talentflow-backend.onrender.com`)

4. **Check logs** for errors (click **Logs** tab)
   - Should see: `Tomcat started on port`
   - Should see: `Started TalentFlowApplication`

---

### PHASE 2: Deploy Frontend (Static Site)

#### Step 2.1: Create Static Site

1. From Render dashboard, click **New+** → **Static Site**
2. Click **Build and deploy from a Git repository**
3. Select **Talent_FLow-Ai** repository
4. Choose **main** branch
5. Click **Connect**

#### Step 2.2: Configure Frontend Service

```
┌──────────────────────────────────────────┐
│ SERVICE INFORMATION                      │
├──────────────────────────────────────────┤
│ Name:            talentflow-frontend     │
│ Build Command:   cd frontend &&          │
│                  npm install &&          │
│                  npm run build           │
│ Publish Directory: frontend/dist         │
│                                          │
│ Plan:            Free                    │
│ Autodeployment:  Enable (default)        │
└──────────────────────────────────────────┘
```

#### Step 2.3: Add Environment Variable

1. Scroll to **Environment**
2. Add:

```
Key:   REACT_APP_API_BASE_URL
Value: https://talentflow-backend.onrender.com/api
       (Use backend URL from Phase 1)
```

#### Step 2.4: Deploy Frontend

1. Click **Create Static Site**
2. **Wait 2-3 minutes** for npm build
3. **Copy the frontend URL** (format: `https://talentflow-frontend.onrender.com`)

---

### PHASE 3: Secure CORS

Now that you have both URLs, update backend CORS:

1. Go to **talentflow-backend** service
2. Click **Environment**
3. Edit `CORS_ORIGINS`:
   - From: `http://localhost:3000`
   - To: `https://talentflow-frontend.onrender.com`
4. Click **Save**
5. **Auto-redeploy** happens (watch Logs)

---

## 🧪 TESTING

### Test 1: Backend Health Check
```bash
curl https://talentflow-backend.onrender.com/api/health
```

**Expected Output**:
```json
{"status":"UP"}
```

### Test 2: Frontend Loads
1. Visit `https://talentflow-frontend.onrender.com` in browser
2. Should see TalentFlow AI landing page
3. No CORS errors in browser console (F12 → Console)

### Test 3: Full Feature Test
1. **Signup**: Create student account
2. **Login**: Login with that account
3. **Post Job** (as recruiter): Create a job posting
4. **View Jobs** (as student): See the posted job on dashboard
5. **Apply to Job**: Submit an application

---

## 🔍 TROUBLESHOOTING

### Issue 1: "mvn: command not found"

**Cause**: Render detected Node.js runtime instead of Java

**Solution**:
1. Go to backend service
2. Click **Settings** → **Environment**
3. Check: Is **Java** selected in Environment dropdown?
4. If not: Delete service and redeploy with **Root Directory** = `backend`

### Issue 2: Build Fails - "Cannot find parent pom"

**Cause**: Root Directory is not set to `backend`

**Solution**:
1. Go to service settings
2. Verify **Root Directory** = `backend` (exactly)
3. Rebuild (click **Manual Deploy**)

### Issue 3: MongoDB Connection Error

**Error Message**: `Unable to connect to MongoDB`

**Solution**:
1. Verify **SPRING_DATA_MONGODB_URI** is set in backend environment
2. Check MongoDB Atlas connection string is correct:
   - Format: `mongodb+srv://username:password@cluster/database`
   - Must include: `?retryWrites=true&w=majority&authSource=admin`
3. Check MongoDB Atlas **IP Whitelist**:
   - Go to MongoDB Atlas dashboard
   - Click **Network Access** → **IP Address**
   - Add `0.0.0.0/0` (allow all IPs)
4. Restart backend service

### Issue 4: Frontend Can't Connect to Backend

**Error in Browser Console**: `CORS error` or `API is undefined`

**Solution**:
1. Check `REACT_APP_API_BASE_URL` in frontend environment
2. Must be: `https://talentflow-backend.onrender.com/api` (exact URL)
3. Redeploy frontend (click **Manual Deploy**)
4. Clear browser cache (Ctrl+Shift+Delete)
5. Test again

### Issue 5: Application Won't Start

**Logs Show**: `Error: Failed to bind to port`

**Solution**:
1. Make sure **Start Command** doesn't hardcode port:
   - ❌ Wrong: `java -jar ... --server.port=8080`
   - ✅ Right: `java -jar target/talentflow-api-1.0.0.jar`
2. Render sets `$PORT` automatically
3. Update start command and redeploy

---

## 📋 CHECKLIST: Before Going to Production

### Backend Checklist
- [ ] Java runtime is selected (not Node)
- [ ] Root Directory = `backend`
- [ ] Build Command = `mvn clean package -DskipTests`
- [ ] Start Command = `java -jar target/talentflow-api-1.0.0.jar`
- [ ] SPRING_DATA_MONGODB_URI is set
- [ ] JWT_SECRET is set
- [ ] CORS_ORIGINS includes frontend URL
- [ ] Logs show "Started TalentFlowApplication"
- [ ] Health check endpoint works

### Frontend Checklist
- [ ] Build Command = `cd frontend && npm install && npm run build`
- [ ] Publish Directory = `frontend/dist`
- [ ] REACT_APP_API_BASE_URL is set correctly
- [ ] Frontend loads without errors
- [ ] No CORS errors in console

### Application Checklist
- [ ] Signup works
- [ ] Login works
- [ ] Dashboard loads
- [ ] Job posting works
- [ ] Jobs are visible to students
- [ ] Applications are tracked

---

## 🛠️ ADVANCED: Manual Configuration (If Auto-Deploy Fails)

If the auto-deployment fails, you can manually configure:

### Render.yaml Alternative
Render also supports `render.yaml` file. If you want to use it:

```yaml
services:
  - type: web
    name: talentflow-backend
    env: java
    buildCommand: mvn clean package -DskipTests
    startCommand: java -jar target/talentflow-api-1.0.0.jar
    envVars:
      - key: SPRING_DATA_MONGODB_URI
        scope: run
      - key: JWT_SECRET
        scope: run
      - key: CORS_ORIGINS
        scope: run

  - type: static_site
    name: talentflow-frontend
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/dist
    envVars:
      - key: REACT_APP_API_BASE_URL
        scope: build
```

Then push and Render will auto-deploy from this config.

---

## 🎓 KEY CONCEPTS

### Why Root Directory Matters
- `Root Directory = ""` (blank) → Uses root of repo
- `Root Directory = "backend"` → Uses `backend/` folder
- Render then looks for `pom.xml` in that directory

### Why Service Type Matters
- **Web Service**: For backend (Java, Python, Node)
- **Static Site**: For frontend (React, Vue, Angular)
- **Can't use Web Service for frontend** - it won't serve static files correctly

### Why Environment Variables Matter
- Never hardcode secrets
- Set in Render dashboard (encrypted)
- Available to application via `${VARIABLE_NAME}` in Spring
- Different for each environment (dev, staging, prod)

---

## 📞 QUICK REFERENCE

### Important URLs
| Service | URL Format |
|---------|-----------|
| Backend API | `https://talentflow-backend.onrender.com/api` |
| Frontend | `https://talentflow-frontend.onrender.com` |
| Logs | Render Dashboard → Service → Logs |
| Environment Vars | Render Dashboard → Service → Settings → Environment |

### Important Files
| File | Purpose |
|------|---------|
| `backend/pom.xml` | Java build config |
| `backend/src/main/resources/application.properties` | Spring config |
| `frontend/package.json` | Node/React config |
| `frontend/vite.config.js` | Vite build config |
| `Procfile` | Optional: Explicit build steps |

### Important Commands
```bash
# Test locally
cd backend
mvn spring-boot:run

# In new terminal
cd frontend
npm run dev

# Push to GitHub
git add .
git commit -m "deploy: render configuration"
git push origin main
```

---

## ✨ SUCCESS INDICATORS

You'll know it's working when:

✅ Backend logs show: `Started TalentFlowApplication`  
✅ Frontend URL loads without errors  
✅ Signup form appears and works  
✅ Dashboard displays after login  
✅ Jobs are visible  
✅ No console errors (F12)  

---

## 🎉 NEXT STEPS

1. ✅ Verify project structure (already done)
2. ✅ Push code to GitHub (provided below)
3. ⬜ Follow PHASE 1-3 above on Render dashboard
4. ⬜ Test all features
5. ⬜ Go live!

---

## 📝 GIT COMMANDS

```bash
# In your project directory
cd "c:\Users\Shashank\OneDrive\Desktop\sd p\TalentFlow-AI"

# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "deploy: fix render configuration for java backend"

# Push to GitHub
git push origin main

# Verify push
git log --oneline -3
```

---

**Last Updated**: April 2026  
**Status**: Ready for Deployment  

Need help? Check troubleshooting section above or review SECURITY_GUIDE.md for environment variable setup.

