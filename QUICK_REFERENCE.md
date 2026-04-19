# TalentFlow AI - Developer Quick Reference Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Clone & Setup
```bash
cd TalentFlow-AI

# Terminal 1: Frontend
cd frontend && npm install && npm run dev

# Terminal 2: Backend  
cd backend && mvn clean install && mvn spring-boot:run

# Terminal 3: MongoDB
# Ensure MongoDB Atlas account is set up and connection string configured
```

### Step 2: Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **MongoDB Atlas**: https://cloud.mongodb.com

### Step 3: Test Login
```
Email: student@example.com
Password: Test123!
Role: Student
```

---

## 📚 Documentation Files Index

| File | Purpose | Read Time |
|------|---------|-----------|
| [README.md](README.md) | Complete project overview | 20 min |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Step-by-step installation | 15 min |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Detailed API reference | 25 min |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Technical architecture | 10 min |
| [mongodb-schema.js](database/mongodb-schema.js) | Database schema | 5 min |

---

## 🗂️ Project Structure

### Frontend (`frontend/`)
```
frontend/
├── src/
│   ├── pages/          ← All page components
│   ├── components/     ← Reusable components
│   ├── stores/         ← Zustand state management
│   ├── services/       ← API calls (api.js)
│   ├── utils/          ← Helper functions
│   ├── styles/         ← CSS and Tailwind
│   ├── App.jsx         ← Main app routing
│   └── main.jsx        ← React entry point
├── package.json        ← Dependencies
├── vite.config.js      ← Build config
├── tailwind.config.js  ← Styling config
└── index.html          ← HTML template
```

### Backend (`backend/`)
```
backend/
├── src/main/java/com/talentflow/
│   ├── controller/     ← REST endpoints
│   ├── service/        ← Business logic
│   ├── entity/         ← Data models
│   ├── repository/     ← Database access
│   ├── dto/            ← Data transfer objects
│   ├── security/       ← JWT & Auth
│   ├── config/         ← Spring config
│   └── TalentFlowApplication.java
├── src/main/resources/
│   └── application.properties ← Configuration
└── pom.xml            ← Maven dependencies
```

---

## 🔑 Key Technologies

### Frontend Stack
- **React 18** - UI Framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State Management
- **Axios** - HTTP Client
- **Vite** - Build Tool

### Backend Stack
- **Spring Boot 3** - Framework
- **Spring Data MongoDB** - Database ORM
- **Spring Security** - Authentication
- **JWT** - Token Security
- **Maven** - Build Tool

### Database
- **MongoDB Atlas** - Cloud Database
- **Collections**: Users, Jobs, Applications, Resumes

---

## 🔌 API Endpoints Summary

### Authentication (4 endpoints)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update profile |

### Jobs (4 endpoints)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/jobs` | List all jobs |
| GET | `/api/jobs/{id}` | Get job details |
| GET | `/api/jobs/search?keyword=` | Search jobs |
| GET | `/api/jobs/trending` | Get trending jobs |

### Applications (4 endpoints)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/applications/apply` | Apply for job |
| GET | `/api/applications/my-applications` | View my applications |
| GET | `/api/applications/{id}` | Get application details |
| PUT | `/api/applications/{id}/status` | Update status |

### Recruiter (6 endpoints)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/recruiter/jobs` | Create job |
| GET | `/api/recruiter/my-jobs` | View my jobs |
| GET | `/api/recruiter/jobs/{jobId}/applicants` | View applicants |
| PUT | `/api/recruiter/applications/{appId}/shortlist` | Shortlist candidate |
| PUT | `/api/recruiter/applications/{appId}/select` | Select candidate |
| PUT | `/api/recruiter/applications/{appId}/reject` | Reject candidate |

---

## 🔐 Authentication Flow

```
1. User Signup
   └─→ POST /api/auth/signup
   └─→ Receive JWT Token

2. User Login
   └─→ POST /api/auth/login
   └─→ Receive JWT Token

3. Protected Requests
   └─→ Include: Authorization: Bearer {token}
   └─→ Backend validates JWT
   └─→ Extract user info from token

4. Token Expiration
   └─→ 24 hours validity
   └─→ User must login again after expiration
```

---

## 📊 Database Collections

### users
- Stores both Student and Recruiter profiles
- Fields: fullName, email, password, phone, role, skills, education, experience, etc.

### jobs
- Job postings by recruiters
- Fields: title, description, location, salary, requiredSkills, applicantCount, etc.

### applications
- Job applications by students
- Fields: jobId, userId, status, matchScore, coverLetter, appliedAt, etc.

### resumes
- Uploaded resume files and extracted data
- Fields: userId, filename, fileUrl, extractedSkills, etc.

---

## 🎨 Color Scheme

| Use | Hex | RGB |
|-----|-----|-----|
| Primary | #6366f1 | Indigo |
| Secondary | #8b5cf6 | Purple |
| Accent | #ec4899 | Pink |
| Dark BG | #0f172a | Dark Blue |
| Light BG | #f8fafc | Light Gray |

---

## 🛠️ Common Commands

### Frontend
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend
```bash
# Build project
mvn clean install

# Run application
mvn spring-boot:run

# Run tests
mvn test

# Skip tests during build
mvn clean install -DskipTests
```

### Database
```bash
# Connect to MongoDB Atlas
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/talentflow"

# View collections
show collections

# Count documents
db.users.countDocuments()

# Create index
db.jobs.createIndex({ title: "text", description: "text" })
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process or change port |
| MongoDB connection failed | Verify connection string and whitelist IP |
| JWT token error | Check token format: `Bearer {token}` |
| CORS error | Verify backend CORS config |
| Build fails | Run `mvn clean install` or `npm install` |
| API timeout | Check backend is running on port 8080 |

---

## 📦 Dependencies

### Frontend (package.json)
- react: ^18.2.0
- tailwindcss: ^3.3.0
- framer-motion: ^10.16.0
- zustand: ^4.4.0
- axios: ^1.6.0
- react-router-dom: ^6.15.0

### Backend (pom.xml)
- spring-boot: 3.1.0
- spring-data-mongodb
- spring-security
- jjwt: 0.11.5
- lombok
- commons-fileupload
- pdfbox: 2.0.27

---

## ✅ Pre-Deployment Checklist

- [ ] Frontend build optimized (`npm run build`)
- [ ] Backend JAR packaged (`mvn package`)
- [ ] MongoDB Atlas credentials configured
- [ ] JWT secret updated to strong value
- [ ] Environment variables set correctly
- [ ] CORS origins configured for production
- [ ] Error logging configured
- [ ] Database backups enabled
- [ ] Security headers configured
- [ ] Rate limiting configured

---

## 🚀 Deployment Options

### Frontend
- **Vercel** - Recommended (free tier available)
- **Netlify** - Alternative option
- **AWS S3 + CloudFront** - Enterprise option
- **GitHub Pages** - Simple static hosting

### Backend
- **Railway.app** - Recommended (free tier available)
- **Heroku** - Alternative option (paid)
- **AWS Elastic Beanstalk** - Enterprise option
- **Azure App Service** - Microsoft cloud

### Database
- **MongoDB Atlas** - Cloud (free tier available)
- **MongoDB Enterprise** - Self-hosted enterprise
- **AWS DocumentDB** - AWS managed MongoDB

---

## 📞 Support & Resources

- **Official Docs**: README.md
- **Setup Help**: SETUP_GUIDE.md
- **API Details**: API_DOCUMENTATION.md
- **Architecture**: PROJECT_SUMMARY.md
- **GitHub**: [Your GitHub URL]
- **Email**: support@talentflow-ai.com
- **Issues**: GitHub Issues

---

## 🎓 Learning Resources

### Frontend
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://github.com/pmndrs/zustand)

### Backend
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [MongoDB Docs](https://docs.mongodb.com/)
- [JWT Guide](https://jwt.io)
- [REST API Best Practices](https://restfulapi.net/)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit (`git commit -m 'Add amazing feature'`)
5. Push (`git push origin feature/amazing-feature`)
6. Open Pull Request

---

## 📝 License

MIT License - Free to use for personal and commercial projects

---

## 🎯 Roadmap

### v1.0 (Current)
- ✅ Job portal with search
- ✅ User authentication
- ✅ Job applications
- ✅ Recruiter dashboard
- ✅ Resume parsing

### v1.1 (Next)
- Email notifications
- Advanced matching algorithm
- Analytics dashboard
- Mobile app

### v2.0 (Future)
- Video interviews
- Payment integration
- LinkedIn integration
- AI recommendations

---

## 🏆 Best Practices

### Code Style
- Use clear, descriptive variable names
- Follow language conventions (camelCase for JS, PascalCase for Java)
- Add comments for complex logic
- Keep functions small and focused

### Security
- Never commit sensitive data (passwords, API keys)
- Use environment variables for secrets
- Validate all user inputs
- Always use HTTPS in production

### Performance
- Minimize API calls from frontend
- Use database indexes for frequent queries
- Implement caching where appropriate
- Optimize bundle size

### Testing
- Write unit tests for services
- Add integration tests for APIs
- Test edge cases
- Use proper test data

---

## 🔍 Version Info

- **TalentFlow AI Version**: 1.0.0
- **React Version**: 18.2.0
- **Spring Boot Version**: 3.1.0
- **MongoDB Version**: 6.0+
- **Node Version**: 16+
- **Java Version**: 17+

---

**Last Updated**: January 2024
**Maintained By**: TalentFlow AI Team
**Status**: Production Ready ✅

---

For detailed information, please refer to the main documentation files listed above.

**Happy Coding!** 🎉
