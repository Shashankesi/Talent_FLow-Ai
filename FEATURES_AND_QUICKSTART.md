# TalentFlow AI - Features & Quick Start Guide

## 🎯 Project Overview

**TalentFlow AI** is a modern job portal with intelligent recruitment automation. It connects job seekers with recruiters using AI-powered matching and provides both students and recruiters with powerful tools.

### For Students:
- Search and browse job listings
- Apply for jobs with resume and cover letter
- Track application status
- Save jobs for later
- Build and manage profile

### For Recruiters:
- Post job openings
- View applicants and their profiles
- Shortlist candidates
- AI-powered candidate matching
- Manage job postings

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Java 17+ installed
- Node.js and npm installed
- MongoDB (local or Atlas)
- Port 3000 and 8081 available

### Step 1: Start Backend
```bash
# Navigate to backend
cd backend

# Build and run
mvn clean package -DskipTests
java -jar target/talentflow-api-1.0.0.jar --server.port=8081

# Or directly run Spring Boot
mvn spring-boot:run
```

Backend will be available at: `http://localhost:8081`

### Step 2: Start Frontend
```bash
# In new terminal, navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### Step 3: Access Application
1. Open `http://localhost:3000` in your browser
2. Click "Sign In" or "Get Started"
3. Choose your role (Student or Recruiter)
4. Create account or use demo credentials

---

## 📋 Feature Checklist

### ✅ Completed Features

#### Authentication
- [x] User signup with role selection
- [x] User login with role-based access
- [x] JWT token-based authentication
- [x] Password encryption with bcrypt
- [x] Secure session management
- [x] Role-based access control

#### User Management
- [x] Student profile creation
- [x] Recruiter profile creation
- [x] Profile information storage
- [x] Role differentiation

#### Job Management
- [x] Job listing API
- [x] Job search functionality
- [x] Job details view
- [x] Job posting by recruiters
- [x] Job status management

#### Application Management
- [x] Job application submission
- [x] Application tracking
- [x] Applicant list for recruiters
- [x] Application status updates

#### UI/UX
- [x] Responsive design (Tailwind CSS)
- [x] Dark mode support
- [x] Smooth animations (Framer Motion)
- [x] Role-based login interface
- [x] Toast notifications
- [x] Loading states

### 🔄 In Progress / Needs MongoDB Fix

#### Due to MongoDB Connection Issue:
- [ ] User registration (blocked - DB write)
- [ ] User login with real accounts (blocked - DB read)
- [ ] Demo account creation (blocked - DB write)
- [ ] Job posting (blocked - DB write)
- [ ] Application submission (blocked - DB write)

### 🎯 To Be Implemented

#### Core Features
- [ ] Resume upload and parsing
- [ ] Skill-based job matching
- [ ] AI recommendation engine
- [ ] Email notifications
- [ ] In-app messaging

#### Student Features
- [ ] Save favorite jobs
- [ ] Create multiple resumes
- [ ] Update skills and experience
- [ ] View recommendation score
- [ ] Set job preferences
- [ ] Interview scheduling

#### Recruiter Features
- [ ] Team collaboration
- [ ] Job analytics
- [ ] Candidate ranking
- [ ] Bulk import candidates
- [ ] Email campaigns
- [ ] Integration with LinkedIn

#### Advanced Features
- [ ] Video resume support
- [ ] Skill assessment tests
- [ ] Portfolio integration
- [ ] Interview feedback
- [ ] Analytics dashboard
- [ ] Custom job templates

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 4.4.5
- **Styling**: Tailwind CSS 3.3.0
- **State Management**: Zustand 4.4.0
- **HTTP Client**: Axios 1.6.0
- **Animations**: Framer Motion 10.16.0
- **Icons**: React Icons 4.12.0
- **Notifications**: React Hot Toast 2.4.1
- **Routing**: React Router DOM 6.15.0

### Backend
- **Framework**: Spring Boot 3.3.0
- **Language**: Java 21
- **Build Tool**: Maven 3.9.15
- **Database**: MongoDB 5.0.1
- **Security**: Spring Security 6.3.0 + JWT
- **Password Encoding**: BCrypt
- **Data Access**: Spring Data MongoDB
- **Validation**: Jakarta Validation

### Database
- **MongoDB Atlas**: Cloud database
- **Alternative**: Local MongoDB Community Edition
- **Connection**: Secure TLS/SSL

---

## 📁 Project Structure

```
TalentFlow-AI/
│
├── backend/
│   ├── src/main/java/com/talentflow/
│   │   ├── config/          # Security & initialization configs
│   │   ├── controller/      # REST API endpoints
│   │   ├── dto/            # Data transfer objects
│   │   ├── entity/         # MongoDB document classes
│   │   ├── repository/     # Data access layer
│   │   ├── security/       # JWT & auth filters
│   │   ├── service/        # Business logic
│   │   └── util/           # Utility classes
│   │
│   ├── src/main/resources/
│   │   └── application.properties  # Configuration
│   │
│   └── pom.xml             # Maven dependencies
│
├── frontend/
│   ├── src/
│   │   ├── pages/          # Page components
│   │   │   ├── auth/       # Login/Signup
│   │   │   ├── student/    # Student pages
│   │   │   └── recruiter/  # Recruiter pages
│   │   │
│   │   ├── components/     # Reusable components
│   │   ├── services/       # API integration (api.js)
│   │   ├── stores/         # Zustand stores
│   │   ├── styles/         # Global styles
│   │   └── utils/          # Helper functions
│   │
│   ├── package.json        # npm dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   └── postcss.config.js   # PostCSS configuration
│
├── database/
│   └── mongodb-schema.js   # Database schema reference
│
└── Documentation files
    ├── README.md           # Project overview
    ├── CURRENT_STATUS.md   # Current status
    ├── MONGODB_TROUBLESHOOTING.md
    └── Setup & guide files
```

---

## 🔑 Key Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/{id}` - Get job details
- `GET /api/jobs/search` - Search jobs
- `GET /api/jobs/trending` - Get trending jobs

### Recruiter
- `POST /api/recruiter/jobs` - Create job posting
- `GET /api/recruiter/my-jobs` - Get recruiter's jobs
- `GET /api/recruiter/jobs/{jobId}/applicants` - Get applicants
- `PUT /api/recruiter/applications/{appId}/shortlist` - Shortlist candidate
- `PUT /api/recruiter/applications/{appId}/select` - Select candidate
- `PUT /api/recruiter/applications/{appId}/reject` - Reject candidate

### Applications
- `POST /api/applications/apply` - Apply for job
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/{id}` - Get application details

---

## 🔐 Demo Credentials

### Student
- **Email**: student@example.com
- **Password**: password
- **Role**: STUDENT

### Recruiter
- **Email**: recruiter@example.com
- **Password**: password
- **Role**: RECRUITER

⚠️ **Note**: These credentials will work once MongoDB is properly connected

---

## 🐛 Known Issues & Fixes

### Issue 1: MongoDB SSL Connection Errors
**Status**: ⚠️ Blocking user registration and login
**Solution**: See `MONGODB_TROUBLESHOOTING.md`

### Issue 2: Demo Accounts Not Created
**Status**: ⚠️ Waiting for MongoDB connection
**Auto-fix**: Will create on first successful DB connection

### Issue 3: Port Already in Use
**Status**: ✅ Fixed with port 8081 for backend
**Solution**: Already updated in configuration

---

## 📞 Troubleshooting Quick Links

- **Can't login?** → Check MongoDB connection (MONGODB_TROUBLESHOOTING.md)
- **Backend won't start?** → Check Java version and ports
- **Frontend won't load?** → Check npm installation
- **Signup fails?** → MongoDB connection issue
- **Jobs not showing?** → Create jobs first, check DB connection

---

## 📝 Environment Configuration

### Backend (application.properties)
```properties
server.port=8081
spring.data.mongodb.uri=mongodb://localhost:27017
spring.data.mongodb.database=talentflow
jwt.secret=REDACTED_JWT_SECRET...
```

### Frontend (api.js)
```javascript
const API_BASE_URL = 'http://localhost:8081/api';
```

---

## 🎓 Learning Resources

- **Spring Boot**: https://spring.io/projects/spring-boot
- **React**: https://react.dev
- **MongoDB**: https://docs.mongodb.com
- **Tailwind CSS**: https://tailwindcss.com
- **JWT**: https://jwt.io

---

## 📊 Development Roadmap

### Phase 1: Core (Current)
- [x] Authentication system
- [x] Basic job listing
- [x] User profiles
- [ ] Fix MongoDB connection ← CURRENT BLOCKER

### Phase 2: Enhancement
- [ ] Resume upload
- [ ] Job applications
- [ ] Email notifications
- [ ] Advanced search

### Phase 3: AI Integration
- [ ] AI job matching
- [ ] Skill-based recommendations
- [ ] Resume parsing
- [ ] Interview scheduling

### Phase 4: Scale
- [ ] Mobile app
- [ ] Admin dashboard
- [ ] Analytics
- [ ] Integrations

---

## 🚢 Deployment

When ready for production:
1. Use MongoDB Atlas with proper IP whitelisting
2. Set up environment variables
3. Build frontend: `npm run build`
4. Deploy to cloud (Heroku, Render, AWS, Azure)
5. Use proper domain and SSL certificates

---

**Last Updated**: April 19, 2026  
**Current Focus**: Fixing MongoDB connection to unblock signup/login testing
