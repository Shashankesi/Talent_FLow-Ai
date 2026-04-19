# 🎯 TalentFlow AI - Full-Stack Job Portal

## 📋 Overview

**TalentFlow AI** is a modern, full-stack job portal application with role-based access (Students/Recruiters).

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Spring Boot 3.3.0 + Java 17 + JWT Auth
- **Database**: MongoDB Atlas (Cloud)
- **Deployment**: Render.com (Free tier available)

---

## ✨ Features

### For Students
- ✅ Create account and manage profile
- ✅ Search and filter jobs
- ✅ Apply to jobs
- ✅ Track applications
- ✅ View application status

### For Recruiters
- ✅ Create account and company profile
- ✅ Post job openings
- ✅ Manage job postings
- ✅ View applicants
- ✅ Track hiring pipeline

### Security
- ✅ JWT-based authentication
- ✅ Password encryption (BCrypt)
- ✅ Role-based access control
- ✅ MongoDB Atlas security
- ✅ Environment-based configuration (no hardcoded secrets)

---

## 📁 Project Structure

```
TalentFlow-AI/
│
├── backend/                                    # Spring Boot Application
│   ├── pom.xml                                # Maven Dependencies
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/talentflow/
│   │   │   │   ├── TalentFlowApplication.java # Main Spring Boot App
│   │   │   │   ├── config/                    # Spring Configuration
│   │   │   │   ├── controller/                # REST APIs
│   │   │   │   ├── entity/                    # Data Models
│   │   │   │   ├── repository/                # Database Access
│   │   │   │   ├── service/                   # Business Logic
│   │   │   │   ├── security/                  # JWT & Auth
│   │   │   │   └── dto/                       # Data Transfer Objects
│   │   │   └── resources/
│   │   │       └── application.properties     # Spring Boot Config
│   │   └── test/                              # Unit Tests
│   └── target/                                # Build Output (gitignored)
│
├── frontend/                                  # React Application
│   ├── package.json                           # NPM Dependencies
│   ├── vite.config.js                         # Vite Build Config
│   ├── index.html                             # HTML Entry
│   ├── src/
│   │   ├── App.jsx                            # Root Component
│   │   ├── main.jsx                           # Entry Point
│   │   ├── pages/                             # Page Components
│   │   ├── components/                        # Reusable Components
│   │   ├── services/                          # API Calls
│   │   ├── stores/                            # State Management (Zustand)
│   │   └── styles/                            # CSS
│   ├── dist/                                  # Build Output (gitignored)
│   └── node_modules/                          # Dependencies (gitignored)
│
├── database/
│   └── mongodb-schema.js                      # MongoDB Collection Schema
│
├── .gitignore                                 # Git Ignore Rules
├── .env.example                               # Environment Template
├── Procfile                                   # Render Deployment Config
├── render.yaml                                # Render Multi-service Config
├── README.md                                  # This File
├── RENDER_DEPLOYMENT_FINAL.md                 # Detailed Deployment Guide
├── SECURITY_GUIDE.md                          # Security Best Practices
├── DEPLOYMENT_CHECKLIST.md                    # Pre-deployment Checklist
└── SECURITY_FIX_SUMMARY.md                    # Security Audit Report
```

---

## 🚀 Quick Start - Local Development

### Prerequisites
- Node.js 18+ (frontend)
- Java 17+ (backend)
- Maven 3.9+ (backend)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone Repository
```bash
git clone https://github.com/Shashankesi/Talent_FLow-Ai.git
cd Talent_FLow-Ai
```

### 2. Setup Backend
```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your MongoDB credentials
# vim .env (or use your editor)

# Build and run
mvn clean install
mvn spring-boot:run

# Backend runs on http://localhost:8081
```

### 3. Setup Frontend (in new terminal)
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8081/api
EOF

# Start development server
npm run dev

# Frontend runs on http://localhost:3000
```

### 4. Access Application
- **URL**: http://localhost:3000
- **Student Login**: Use "Student" button to signup/login
- **Recruiter Login**: Use "Recruiter" button to signup/login

---

## 🌐 Production Deployment - Render

### Prerequisites
- GitHub account with code pushed
- Render.com account
- MongoDB Atlas credentials

### Quick Deploy (20 minutes)

**Step 1**: Push code to GitHub
```bash
git add .
git commit -m "deploy: ready for render"
git push origin main
```

**Step 2**: Deploy Backend
1. Go to https://render.com/dashboard
2. Click **New+** → **Web Service**
3. Select **Talent_FLow-Ai** repository
4. Set:
   - Root Directory: `backend`
   - Environment: `Java`
   - Build: `mvn clean package -DskipTests`
   - Start: `java -jar target/talentflow-api-1.0.0.jar`
5. Add environment variables:
   - `SPRING_DATA_MONGODB_URI` = MongoDB connection string
   - `JWT_SECRET` = Generated secret (openssl rand -base64 32)
   - `CORS_ORIGINS` = `*` (update later)
6. Deploy

**Step 3**: Deploy Frontend
1. Click **New+** → **Static Site**
2. Select **Talent_FLow-Ai** repository
3. Set:
   - Build: `cd frontend && npm install && npm run build`
   - Publish: `frontend/dist`
4. Add environment variable:
   - `REACT_APP_API_BASE_URL` = Backend URL from Step 2
5. Deploy

**Step 4**: Update Backend CORS
1. Go to backend service
2. Update `CORS_ORIGINS` to frontend URL
3. Save and redeploy

### Detailed Guide
See [RENDER_DEPLOYMENT_FINAL.md](./RENDER_DEPLOYMENT_FINAL.md) for complete step-by-step instructions with troubleshooting.

---

## 🔐 Security

### Environment Variables (Never Hardcode!)
All sensitive data is stored in environment variables:

```
SPRING_DATA_MONGODB_URI    # MongoDB connection
JWT_SECRET                 # JWT signing key
CORS_ORIGINS              # CORS whitelist
```

### Features
- ✅ Password encryption (BCrypt)
- ✅ JWT-based authentication
- ✅ HTTPS enabled (Render)
- ✅ MongoDB encryption at rest
- ✅ No secrets in code/git

### Setup
1. Copy `.env.example` to `.env`
2. Fill with your actual values
3. **Never commit `.env`** (it's in .gitignore)

See [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) for detailed security procedures.

---

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/signup       # Create new user
POST   /api/auth/login        # Login and get token
POST   /api/auth/refresh      # Refresh JWT token
```

### Jobs (Public)
```
GET    /api/jobs              # List all jobs
GET    /api/jobs/:id          # Get job details
```

### Jobs (Recruiter Only)
```
POST   /api/recruiter/jobs    # Create job posting
PUT    /api/recruiter/jobs/:id      # Update job
DELETE /api/recruiter/jobs/:id      # Delete job
GET    /api/recruiter/applicants    # View applicants
```

### Applications (Student)
```
POST   /api/applications           # Apply to job
GET    /api/applications           # View my applications
GET    /api/applications/:id       # View application details
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

---

## 🧪 Testing

### Local Testing
```bash
# Backend health check
curl http://localhost:8081/api/health

# Frontend
Open http://localhost:3000 in browser

# Test signup
Click "Student" → Signup → Fill form

# Test login
Login with created account
```

### Production Testing
```bash
# Backend health
curl https://talentflow-backend.onrender.com/api/health

# Frontend
Visit https://talentflow-frontend.onrender.com

# Full feature test
- Signup as student
- Login
- Create recruiter account
- Post job
- View job as student
- Apply to job
```

---

## 🛠️ Troubleshooting

### Local Issues
| Issue | Solution |
|-------|----------|
| `mvn not found` | Install Maven or add to PATH |
| `MongoDB connection error` | Check connection string in `.env` |
| `Port already in use` | Change port in `application.properties` |
| Frontend can't connect | Check `VITE_API_BASE_URL` in `.env` |

### Render Issues
| Issue | Solution |
|-------|----------|
| "mvn: command not found" | Set Root Directory = `backend` in Render |
| Build fails | Check environment variables are set |
| CORS error | Update `CORS_ORIGINS` to include frontend URL |
| Can't connect to MongoDB | Check IP whitelist in MongoDB Atlas |

See [RENDER_DEPLOYMENT_FINAL.md](./RENDER_DEPLOYMENT_FINAL.md) for detailed troubleshooting.

---

## 📚 Documentation

- [RENDER_DEPLOYMENT_FINAL.md](./RENDER_DEPLOYMENT_FINAL.md) - Complete Render setup guide
- [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) - Security best practices
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist
- [SECURITY_FIX_SUMMARY.md](./SECURITY_FIX_SUMMARY.md) - Security audit results
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference

---

## 📦 Tech Stack Details

### Backend
- **Framework**: Spring Boot 3.3.0
- **Language**: Java 17
- **Database**: MongoDB 4.0+
- **Authentication**: JWT (HS256)
- **Security**: Spring Security 6.3.0
- **Build**: Maven 3.9+

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 4.4.5
- **Styling**: Tailwind CSS 3.3.0
- **State Management**: Zustand 4.4.0
- **HTTP Client**: Axios 1.6.0
- **Routing**: React Router 6.15.0
- **Animations**: Framer Motion 10.16.0

### Infrastructure
- **Database**: MongoDB Atlas (Cloud)
- **Hosting**: Render.com
- **Version Control**: Git/GitHub
- **CI/CD**: Render auto-deploy

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💼 Support

For issues or questions:
1. Check troubleshooting sections above
2. Review relevant documentation files
3. Check GitHub Issues
4. Review application logs (Render dashboard)

---

## 🎉 Getting Started

**New to the project?** Start here:

1. Read [RENDER_DEPLOYMENT_FINAL.md](./RENDER_DEPLOYMENT_FINAL.md) for deployment
2. Review [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) for security
3. Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for endpoints
4. Follow "Quick Start" section above for local development

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅

