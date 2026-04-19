# 🔐 TalentFlow AI - Security & Deployment Guide

## ⚠️ CRITICAL: Security Overview

This document covers security best practices, credentials management, and safe deployment procedures.

---

## 🚨 What Was Fixed

### **Removed Exposed Credentials**
- ❌ Hardcoded MongoDB URI from `application.properties`
- ❌ Hardcoded JWT secret from `application.properties`
- ❌ Hardcoded MongoDB URI from `render.yaml`
- ❌ Exposed credentials from documentation files

### **Current State: ✅ SECURE**
- ✅ All secrets use environment variables
- ✅ Proper `.gitignore` prevents accidental commits
- ✅ `.env` files are never tracked
- ✅ Git history cleaned (secrets removed from commits)

---

## 📋 Environment Variables (Required)

### Backend (.env in `backend/` directory)

```bash
# Server Configuration
PORT=8080

# MongoDB Atlas Connection (REQUIRED)
SPRING_DATA_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/talentflow?retryWrites=true&w=majority&authSource=admin

# JWT Secret (REQUIRED)
# Generate: openssl rand -base64 32
JWT_SECRET=your-min-32-character-secret-key-here

# CORS Origins
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend (.env in `frontend/` directory)

```bash
# Backend API URL
VITE_API_BASE_URL=http://localhost:8081/api
```

---

## 🔧 Local Development Setup

### Step 1: Install Dependencies
```bash
cd backend
mvn clean install

cd ../frontend
npm install
```

### Step 2: Create .env Files (Local Development)
```bash
# Backend .env
cd backend
cp .env.example .env
# Edit .env with your MongoDB credentials

# Frontend .env
cd ../frontend
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8081/api
EOF
```

### Step 3: Get MongoDB Connection String
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create/select cluster → **Connect** button
3. Copy connection string: `mongodb+srv://...`
4. Replace `<username>` and `<password>` with your credentials
5. Paste into backend `.env` file

### Step 4: Generate JWT Secret
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
```

### Step 5: Run Locally
```bash
# Terminal 1: Backend
cd backend
mvn spring-boot:run

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## 🚀 Render Deployment

### Prerequisites
- GitHub account with pushed code
- Render.com account (free tier available)
- MongoDB Atlas account with cluster

### Step 1: Connect GitHub to Render

1. Go to [Render.com](https://render.com)
2. Sign up/Login
3. **Create New** → **Web Service**
4. Connect GitHub account
5. Select `Talent_FLow-Ai` repository
6. Choose `main` branch

### Step 2: Configure Backend Service

**Basic Settings:**
- Name: `talentflow-backend`
- Root Directory: `backend`
- Runtime: `Java 21`
- Build Command: `mvn clean package -DskipTests`
- Start Command: `java -Dserver.port=$PORT -jar target/talentflow-api-*.jar`
- Instance Type: Free (adequate for development)

**Environment Variables:**

| Key | Value | Source |
|-----|-------|--------|
| `SPRING_DATA_MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas |
| `JWT_SECRET` | Generate with `openssl rand -base64 32` | Generate new |
| `CORS_ORIGINS` | `https://talentflow-frontend.onrender.com` | Will be set later |

### Step 3: Configure Frontend Service

1. **Create New** → **Static Site**
2. Connect same GitHub repo
3. Build Command: `cd frontend && npm install && npm run build`
4. Publish Directory: `frontend/dist`

**Environment Variables:**

| Key | Value |
|-----|-------|
| `REACT_APP_API_BASE_URL` | `https://talentflow-backend.onrender.com/api` |

### Step 4: Connect Services
1. Get backend URL from Render dashboard (format: `https://talentflow-backend.onrender.com`)
2. Update frontend `REACT_APP_API_BASE_URL`
3. Update backend `CORS_ORIGINS` to include frontend URL

---

## 🔑 Managing Secrets Securely

### DO ✅
- [ ] Use environment variables for all secrets
- [ ] Generate strong JWT secrets: `openssl rand -base64 32`
- [ ] Store secrets in `.env` files (local) or hosting dashboard (production)
- [ ] Add `.env` to `.gitignore` (already done)
- [ ] Use `.env.example` to show required variables (no values)
- [ ] Rotate secrets periodically
- [ ] Use MongoDB Atlas IP whitelisting
- [ ] Enable MongoDB Atlas VPC for production

### DON'T ❌
- [ ] Never hardcode secrets in code files
- [ ] Never commit `.env` files to git
- [ ] Never share secrets in chat/messages/docs
- [ ] Never use default or simple secrets
- [ ] Never disable SSL/TLS in production
- [ ] Never commit `application-prod.properties` with secrets
- [ ] Never expose credentials in logs
- [ ] Never use `console.log()` with sensitive data

---

## 🧪 Testing Credentials (Safe Methods)

### Option 1: Local Development
```bash
# Create temporary .env in terminal session
export SPRING_DATA_MONGODB_URI="your_connection_string"
export JWT_SECRET="your_secret"

# Run app
mvn spring-boot:run
```

### Option 2: Test with curl
```bash
# Signup
curl -X POST http://localhost:8081/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User","role":"STUDENT"}'

# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 📊 Checklist for Production Deployment

- [ ] All secrets removed from code files
- [ ] `.env` files added to `.gitignore`
- [ ] Environment variables set in Render dashboard
- [ ] MongoDB Atlas IP whitelist configured
- [ ] CORS origins updated for production URL
- [ ] SSL/TLS enabled (automatic with Render)
- [ ] Health check endpoint configured (`/api/health`)
- [ ] Logs monitored for errors
- [ ] Database backups enabled
- [ ] Secrets rotated every 90 days

---

## 🔍 Verification Steps

### Verify No Secrets in Git
```bash
# Search for exposed credentials in history
git log --all --full-history -S "mongodb+srv" -- .

# If found, history has been cleaned
```

### Verify Environment Variables are Used
```bash
# Backend: Check application.properties
grep -E "SPRING_DATA_MONGODB_URI|JWT_SECRET|CORS_ORIGINS" \
  backend/src/main/resources/application.properties

# Frontend: Check api.js
grep "REACT_APP_API_BASE_URL" frontend/src/services/api.js
```

### Test with Mock Secrets
```bash
# Create test .env
export SPRING_DATA_MONGODB_URI="test_uri"
export JWT_SECRET="test_secret_min_32_characters_required_for_hs256_algorithm"
export CORS_ORIGINS="http://localhost:3000"

# Run app
mvn spring-boot:run
```

---

## 🆘 Security Incident Response

### If Secrets Are Exposed

1. **Immediately**
   ```bash
   # Rotate all exposed secrets
   # Generate new JWT secret
   openssl rand -base64 32
   
   # Reset MongoDB password in MongoDB Atlas
   # Update all services with new credentials
   ```

2. **Clean Git History** (if in committed history)
   ```bash
   # Requires git-filter-repo
   pip install git-filter-repo
   
   # Remove sensitive strings
   git filter-repo --replace-text /path/to/replacements.txt
   
   # Force push (dangerous - coordinate with team)
   git push --force-with-lease origin main
   ```

3. **Audit & Monitor**
   - Check MongoDB Atlas activity logs
   - Review git logs for unauthorized access
   - Enable 2FA on all accounts
   - Update GitHub deploy keys

---

## 📚 Additional Resources

- [MongoDB Atlas Security](https://docs.mongodb.com/atlas/security/secrets-management/)
- [Spring Boot Security Best Practices](https://spring.io/projects/spring-security)
- [OWASP: Secrets Management](https://owasp.org/www-community/Sensitive_Data_Exposure)
- [Render Documentation](https://render.com/docs)
- [Environment Variables Best Practices](https://12factor.net/config)

---

## 📞 Support

For security concerns:
1. Check this guide first
2. Review `.env.example` for required variables
3. Test locally with mock values
4. Deploy to Render staging first

**Last Updated**: April 2026  
**Status**: ✅ Production Ready

