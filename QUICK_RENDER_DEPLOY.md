# ⚡ Quick Deploy to Render (5 Steps)

## 🚀 Express Deployment Guide

Your TalentFlow AI is ready for Render! Here's the fastest path to deployment.

---

## **STEP 1: Push to GitHub** (5 minutes)

```bash
cd "c:\Users\Shashank\OneDrive\Desktop\sd p\TalentFlow-AI"

git init
git add .
git commit -m "Deploy to Render"
git remote add origin https://github.com/YOUR_USERNAME/talentflow-ai.git
git branch -M main
git push -u origin main
```

---

## **STEP 2: Deploy Backend** (3 minutes)

1. Go to https://dashboard.render.com
2. Sign up (free account)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repo `talentflow-ai`
5. Set these settings:
   - **Name**: `talentflow-backend`
   - **Environment**: `Docker`
   - **Build Command**: `cd backend && ./mvnw clean package -DskipTests`
   - **Start Command**: `java -Dserver.port=$PORT -jar target/talentflow-api-*.jar`
   - **Plan**: Free (or Starter $7/month)

6. Click **"Advanced"** and add these Environment Variables:
   ```
   MONGODB_URI = mongodb+srv://REDACTED@REDACTED_CLUSTER.mrrc1c2.mongodb.net/talentflow?retryWrites=true&w=majority&authSource=admin
   
   JWT_SECRET = REDACTED_JWT_SECRET-production-minimum-32-characters-required-for-hs256
   
   CORS_ORIGINS = https://talentflow-frontend.onrender.com
   ```

7. Click **"Create Web Service"** and wait for deployment (5-10 min)
8. **Copy the backend URL** when it's done (e.g., `https://talentflow-backend.onrender.com`)

---

## **STEP 3: Deploy Frontend** (2 minutes)

1. Go back to Render dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect the same GitHub repo
4. Set these settings:
   - **Name**: `talentflow-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

5. Click **"Create Static Site"** and wait (3-5 min)
6. **Copy the frontend URL** when done (e.g., `https://talentflow-frontend.onrender.com`)

---

## **STEP 4: Update Backend CORS** (1 minute)

1. Go to your backend service in Render
2. Click **"Environment"**
3. Update `CORS_ORIGINS`:
   ```
   https://talentflow-frontend.onrender.com,http://localhost:3000
   ```
4. Click **"Save"** - backend will redeploy automatically

---

## **STEP 5: Test It!** (1 minute)

1. Visit: `https://talentflow-frontend.onrender.com`
2. Try signup/login
3. Post a job (as recruiter)
4. See it on student dashboard

---

## ✅ **You're Done!**

Your TalentFlow AI is now live on Render! 🎉

**Your URLs**:
- Frontend: `https://talentflow-frontend.onrender.com`
- Backend API: `https://talentflow-backend.onrender.com/api`
- Database: MongoDB Atlas (already configured)

---

## 💡 **Pro Tips**

✅ **Free Tier Works!** - Both services run free on Render (backend pauses after 15 min of inactivity)
✅ **Auto Deploy** - Just push to GitHub, Render automatically deploys
✅ **MongoDB Atlas** - Already working with Render
✅ **Custom Domain** - Add your domain later in Render settings

---

## 🐛 **If Something Goes Wrong**

1. Check **Logs** in Render dashboard (click service → "Logs")
2. Common issues:
   - ❌ CORS error → Update `CORS_ORIGINS` environment variable
   - ❌ MongoDB error → Check MongoDB Atlas Network Access (allow 0.0.0.0/0)
   - ❌ API not found → Check backend deployment is complete
   - ❌ Frontend blank → Clear browser cache, refresh

---

## 📚 **Full Guide**

See `RENDER_DEPLOYMENT_GUIDE.md` for:
- Detailed troubleshooting
- Cost breakdown
- Alternative deployment options
- Advanced configuration

---

## 🎯 **Next Steps**

1. **Push to GitHub** (if not done)
2. **Deploy backend** on Render
3. **Deploy frontend** on Render
4. **Test** your app
5. **Share your URL** with the world! 🚀

---

**Total Time**: ~20-30 minutes
**Cost**: $0 (free tier) or $7/month (starter)
**Complexity**: Very Simple ✅

Good luck! 🚀
