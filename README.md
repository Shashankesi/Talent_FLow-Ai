# TalentFlow AI - Job Portal with Recruitment Automation

A production-level job portal application with intelligent recruitment automation, built with React.js, Spring Boot, and MongoDB Atlas.

## 🌟 Features

### For Job Seekers
- **Profile Management**: Complete profile setup with skills, education, and experience
- **Resume Upload**: Upload and auto-parse resumes for skill extraction
- **Job Search**: Advanced search with filters (skills, location, salary, experience)
- **Job Application**: Easy one-click application with cover letter
- **Application Tracking**: Track application status and match scores
- **Dashboard**: View recommended jobs and application statistics

### For Recruiters
- **Company Registration**: Set up company profile and details
- **Job Posting**: Create and manage job postings
- **Applicant Management**: View all applicants with detailed profiles
- **Resume Review**: Download and view applicant resumes
- **Smart Shortlisting**: View match scores and shortlist candidates
- **Hiring Pipeline**: Track candidates through APPLIED → SHORTLISTED → INTERVIEW → SELECTED/REJECTED

### AI & Automation Features
- **Resume Parsing**: Automatic skill extraction from PDFs
- **Match Score**: AI-powered candidate-job matching (0-100%)
- **Auto Suggestions**: Intelligent job recommendations based on profile
- **Application Pipeline**: Visual applicant tracking system

## 📋 Tech Stack

### Frontend
- **React.js 18** - UI library
- **Tailwind CSS 3** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend
- **Spring Boot 3.1** - Framework
- **Spring Data MongoDB** - Database ORM
- **Spring Security** - Authentication & Authorization
- **JWT** - Token-based authentication
- **Maven** - Build tool

### Database
- **MongoDB Atlas** - NoSQL database
- **Apache PDFBox** - Resume parsing

## 📁 Project Structure

```
TalentFlow-AI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── auth/
│   │   │   │   ├── Signup.jsx
│   │   │   │   └── Login.jsx
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   ├── StudentProfile.jsx
│   │   │   │   ├── JobSearch.jsx
│   │   │   │   ├── JobDetails.jsx
│   │   │   │   └── MyApplications.jsx
│   │   │   └── recruiter/
│   │   │       ├── RecruiterDashboard.jsx
│   │   │       ├── PostJob.jsx
│   │   │       └── ViewApplicants.jsx
│   │   ├── stores/
│   │   │   ├── authStore.js
│   │   │   └── jobStore.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── backend/
│   ├── src/main/java/com/talentflow/
│   │   ├── TalentFlowApplication.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Job.java
│   │   │   ├── Application.java
│   │   │   └── Resume.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── JobController.java
│   │   │   ├── ApplicationController.java
│   │   │   └── RecruiterController.java
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   ├── JobService.java
│   │   │   └── ApplicationService.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── JobRepository.java
│   │   │   ├── ApplicationRepository.java
│   │   │   └── ResumeRepository.java
│   │   ├── dto/
│   │   │   ├── AuthDTO.java
│   │   │   └── JobDTO.java
│   │   ├── security/
│   │   │   ├── JwtTokenProvider.java
│   │   │   └── JwtAuthenticationFilter.java
│   │   └── config/
│   │       └── SecurityConfig.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── database/
    └── mongodb-schema.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Java 17+
- Maven 3.8+
- MongoDB Atlas account (or local MongoDB)
- Git

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```
The application will be available at `http://localhost:3000` or `http://localhost:5173`

4. **Build for production**
```bash
npm run build
```

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Configure MongoDB**
   - Update `src/main/resources/application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/talentflow?retryWrites=true&w=majority
   ```

3. **Configure JWT Secret**
   - Update the JWT secret in `application.properties`:
   ```properties
   jwt.secret=your-very-long-and-secure-secret-key-here-at-least-32-chars
   ```

4. **Build the project**
```bash
mvn clean install
```

5. **Run the application**
```bash
mvn spring-boot:run
```
The API will be available at `http://localhost:8080`

### Database Setup

1. **Create MongoDB Atlas Account**
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a cluster
   - Get connection string

2. **Initialize Collections**
   - Import `database/mongodb-schema.js` to create collections and indexes
   - Or run the script in MongoDB Compass/Atlas UI

## 📚 API Documentation

### Authentication Endpoints

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "phone": "+1 (555) 000-0000",
  "role": "STUDENT", // or "RECRUITER"
  "companyName": "Tech Corp" // For recruiters
}

Response:
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "role": "STUDENT",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com",
    "profileCompletion": 60.0
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "role": "STUDENT",
  "user": { ... }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}

Response:
{
  "id": "user_id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 000-0000",
  "skills": ["React", "JavaScript"],
  "profileCompletion": 75.0
}
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "John Doe",
  "phone": "+1 (555) 000-0000",
  "skills": ["React", "JavaScript", "MongoDB"],
  "education": "B.S. in Computer Science",
  "experience": "5 years as a full-stack developer"
}

Response: Updated user object
```

### Job Endpoints

#### Get All Jobs
```http
GET /api/jobs

Response:
[
  {
    "id": "job_id",
    "title": "Senior React Developer",
    "companyName": "Tech Corp",
    "location": "San Francisco, CA",
    "salary": 180000,
    "requiredSkills": ["React", "JavaScript", "TypeScript"],
    "applicantCount": 25,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Job by ID
```http
GET /api/jobs/{id}

Response: Job object with full details
```

#### Search Jobs
```http
GET /api/jobs/search?keyword=react

Response: Array of matching jobs
```

#### Get Trending Jobs
```http
GET /api/jobs/trending

Response: Top 10 jobs by applicant count
```

### Application Endpoints

#### Apply for Job
```http
POST /api/applications/apply
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- jobId: "job_id_123"
- resume: (file)
- coverLetter: "I am interested in this position..."

Response:
{
  "id": "app_id",
  "jobId": "job_id",
  "userId": "user_id",
  "status": "APPLIED",
  "matchScore": 92,
  "appliedAt": "2024-01-05T10:30:00Z"
}
```

#### Get My Applications
```http
GET /api/applications/my-applications
Authorization: Bearer {token}

Response: Array of user's applications
```

### Recruiter Endpoints

#### Create Job
```http
POST /api/recruiter/jobs
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Senior React Developer",
  "description": "We are looking for...",
  "location": "San Francisco, CA",
  "salary": 180000,
  "experienceRequired": 5,
  "jobType": "Full Time",
  "requiredSkills": ["React", "JavaScript", "TypeScript"],
  "requirements": ["5+ years experience", "Strong React skills"]
}

Response: Created job object
```

#### Get My Jobs
```http
GET /api/recruiter/my-jobs
Authorization: Bearer {token}

Response: Array of recruiter's jobs
```

#### Get Job Applicants
```http
GET /api/recruiter/jobs/{jobId}/applicants
Authorization: Bearer {token}

Response: Array of applications for the job
```

#### Shortlist Candidate
```http
PUT /api/recruiter/applications/{applicationId}/shortlist
Authorization: Bearer {token}

Response: { "message": "Candidate shortlisted" }
```

#### Select Candidate
```http
PUT /api/recruiter/applications/{applicationId}/select
Authorization: Bearer {token}

Response: { "message": "Candidate selected" }
```

#### Reject Candidate
```http
PUT /api/recruiter/applications/{applicationId}/reject
Authorization: Bearer {token}

Response: { "message": "Candidate rejected" }
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: BCrypt encryption for passwords
- **CORS Protection**: Configurable CORS for cross-origin requests
- **Role-Based Access**: Student and Recruiter role separation
- **Protected Routes**: Frontend route protection based on authentication
- **Secure API Endpoints**: Backend endpoint protection with JWT validation

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional SaaS-like interface
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Layout**: Mobile-first design approach
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Loading States**: Skeleton loaders and spinners
- **Form Validation**: Client and server-side validation
- **Error Handling**: User-friendly error messages with toast notifications

## 🤖 AI/Automation Features

### Resume Parsing
- Extracts text from PDF resumes
- Automatically identifies skills
- Parses education and experience sections

### Smart Matching
- Calculates match score between job and candidate
- Based on skill overlap percentage
- Helps prioritize applications

### Recommendations
- AI-powered job recommendations for job seekers
- Trending jobs based on popularity
- Personalized suggestions based on skills

## 📊 Database Design

### Users Collection
- Stores job seeker and recruiter profiles
- Tracks profile completion percentage
- Indexes on email for quick lookup

### Jobs Collection
- Job postings with detailed descriptions
- Required skills and requirements
- Tracks applicant counts

### Applications Collection
- Application history with status tracking
- Match scores and cover letters
- Timeline tracking (applied, shortlisted, selected, rejected)

### Resumes Collection
- Stores uploaded resume files
- Extracted skills and information
- User reference for quick access

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
```

### Backend Testing
```bash
cd backend
mvn test
```

## 📦 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy the dist folder
```

### Backend Deployment (Heroku/AWS/Railway)
```bash
mvn clean package
# Deploy the jar file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@talentflow-ai.com or open an issue on GitHub.

## 🎯 Roadmap

- [ ] Email notifications for applications
- [ ] Video interview scheduling
- [ ] Advanced analytics dashboard
- [ ] Integration with LinkedIn
- [ ] Mobile app (React Native)
- [ ] Salary calculator tool
- [ ] Interview preparation resources
- [ ] Payment integration for premium features

---

**TalentFlow AI** - Where talent meets opportunity! 🚀
#   T a l e n t _ F L o w - A i  
 