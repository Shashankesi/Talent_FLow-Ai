# Quick Start Guide - TalentFlow-AI

## 🚀 Start Development Servers

### Terminal 1: Start Backend
```bash
cd "c:\Users\Shashank\OneDrive\Desktop\sd p\TalentFlow-AI\backend"
mvn spring-boot:run
```
**Backend runs on**: `http://localhost:8080`

### Terminal 2: Start Frontend
```bash
cd "c:\Users\Shashank\OneDrive\Desktop\sd p\TalentFlow-AI\frontend"
npm run dev
```
**Frontend runs on**: `http://localhost:5173`

---

## ✅ What Was Fixed

### Backend Fixes
1. ✅ Created missing `CreateJobRequest.java` DTO
2. ✅ Updated Spring Security config to use new 6.1+ API (removed deprecated methods)
3. ✅ Updated MongoDB connection string with actual credentials
4. ✅ Fixed Spring Boot version (3.1.0 → 3.3.0) for Java 21 compatibility
5. ✅ Added Maven compiler plugin configuration
6. ✅ Fixed unused imports and variables
7. ✅ Added missing `getApplicationById()` and `updateApplicationStatus()` methods

### Frontend Fixes
1. ✅ Fixed CSS conflict in `JobDetails.jsx` (removed conflicting `block` class)
2. ✅ Installed all npm dependencies (184 packages)

### Database Configuration
- ✅ MongoDB Atlas connection configured
- ✅ Connection string: `mongodb+srv://REDACTED@REDACTED_CLUSTER.mrrc1c2.mongodb.net/?appName=TalentFlowCluster`

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/{id}` - Get specific job
- `GET /api/jobs/search?keyword=...` - Search jobs
- `POST /api/jobs/filter` - Filter jobs
- `GET /api/jobs/trending` - Get trending jobs

### Recruiter
- `POST /api/recruiter/jobs` - Create job posting
- `GET /api/recruiter/my-jobs` - Get recruiter's jobs
- `GET /api/recruiter/jobs/{jobId}/applicants` - Get job applicants
- `PUT /api/recruiter/applications/{appId}/shortlist` - Shortlist candidate
- `PUT /api/recruiter/applications/{appId}/select` - Select candidate
- `PUT /api/recruiter/applications/{appId}/reject` - Reject candidate

### Applications
- `POST /api/applications/apply` - Apply for job
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/{id}` - Get application details
- `PUT /api/applications/{id}/status` - Update application status

---

## 🛠️ Technology Stack

**Backend**
- Java 17
- Spring Boot 3.3.0
- Spring Security 6.3.0
- Spring Data MongoDB
- JWT (jjwt 0.11.5)
- Lombok

**Frontend**
- React 18.2.0
- Vite 4.4.5
- React Router DOM 6.15.0
- Tailwind CSS 3.3.0
- Axios 1.6.0
- Zustand (State Management)

**Database**
- MongoDB Atlas
- Collections: users, jobs, applications, resumes

---

## 📝 Build Status

```
✅ Backend: BUILD SUCCESS (22 files compiled)
✅ Frontend: All 184 dependencies installed
✅ MongoDB: Connected (via Atlas URI)
✅ Security: JWT-based authentication configured
```

---

## ⚠️ Notes

- The backend requires Java 17 or higher
- MongoDB connection uses Atlas cloud instance
- CORS is enabled for localhost:3000 and localhost:5173
- JWT token expires in 24 hours
- Max file upload size: 10MB

---

## 🐛 If You Encounter Issues

### Backend won't start
```bash
# Set Java version explicitly
set JAVA_HOME=C:\Program Files\Java\jdk-21
mvn clean install
mvn spring-boot:run
```

### Frontend shows blank page
- Check browser console for errors
- Ensure backend is running on port 8080
- Clear browser cache and reload

### MongoDB connection fails
- Verify internet connection (Atlas requires it)
- Check credentials in `application.properties`
- Ensure IP is whitelisted in MongoDB Atlas

---

## 📚 Additional Resources

See `FIXES_COMPLETED.md` for detailed information about all changes made.

Happy coding! 🎉
