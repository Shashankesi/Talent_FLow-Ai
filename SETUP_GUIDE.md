# TalentFlow AI - Step-by-Step Setup Guide

## Prerequisites Checklist
- [ ] Node.js 16+ installed
- [ ] Java 17+ installed
- [ ] Maven 3.8+ installed
- [ ] MongoDB Atlas account created
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## PART 1: Frontend Setup (React.js)

### Step 1: Navigate to Frontend Directory
```bash
cd TalentFlow-AI/frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages listed in package.json:
- React 18.2
- React Router DOM
- Tailwind CSS
- Framer Motion
- Axios
- Zustand
- And more...

### Step 3: Start Development Server
```bash
npm run dev
```

You should see:
```
VITE v4.4.5 ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Press h to show help
```

Visit `http://localhost:5173` in your browser.

### Step 4: Verify Frontend is Working
- You should see the TalentFlow AI landing page
- Navigation menu should be visible
- Dark mode toggle should work

## PART 2: Backend Setup (Spring Boot)

### Step 1: Navigate to Backend Directory
```bash
cd TalentFlow-AI/backend
```

### Step 2: Configure MongoDB Connection

#### Option A: Using MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up and create a free cluster
3. Create a database user and password
4. Click "Connect" and copy the connection string
5. Update `src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=mongodb+srv://username:password@cluster0.mongodb.net/talentflow?retryWrites=true&w=majority
```

#### Option B: Using Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # On Windows
   net start MongoDB
   
   # On Mac
   brew services start mongodb-community
   ```
3. Update `src/main/resources/application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/talentflow
   ```

### Step 3: Configure JWT Secret
Update the JWT secret in `application.properties`:
```properties
jwt.secret=your-super-long-and-secure-secret-key-make-it-at-least-32-characters-long
jwt.expiration=86400000
```

### Step 4: Build the Project
```bash
mvn clean install
```

This will:
- Download all dependencies
- Compile Java code
- Run tests
- Create a JAR file

### Step 5: Run the Spring Boot Application
```bash
mvn spring-boot:run
```

You should see:
```
Started TalentFlowApplication in XX.XXX seconds
```

Visit `http://localhost:8080` to verify the API is running.

## PART 3: Database Setup

### Step 1: Create MongoDB Collections

Option A: Using MongoDB Compass (Recommended)
1. Download MongoDB Compass from https://www.mongodb.com/products/compass
2. Connect to your MongoDB instance
3. Open a terminal in Compass
4. Paste the contents of `database/mongodb-schema.js`
5. Execute the script

Option B: Using MongoDB Shell
```bash
# Open MongoDB shell
mongosh "mongodb+srv://username:password@cluster.mongodb.net"

# Use the database
use talentflow

# Paste contents from database/mongodb-schema.js
```

### Step 2: Verify Collections Created
```bash
# In MongoDB shell or Compass
show collections

# Should output:
# users
# jobs
# applications
# resumes
```

## PART 4: Connect Frontend to Backend

### Update API Base URL
If your backend is not at `http://localhost:8080`, update:
1. Edit `frontend/src/services/api.js`
2. Change `API_BASE_URL`:
   ```javascript
   const API_BASE_URL = 'http://your-backend-url/api';
   ```

## PART 5: Test the Application

### User Registration Test

1. **Student Signup**
   - Go to http://localhost:5173/signup
   - Select "Job Seeker"
   - Fill in the form:
     - Name: John Doe
     - Email: student@example.com
     - Password: Test123!
     - Phone: 5551234567
   - Click "Create Account"
   - Should redirect to Student Dashboard

2. **Recruiter Signup**
   - Go to http://localhost:5173/signup
   - Select "Recruiter"
   - Fill in the form:
     - Name: Jane Smith
     - Email: recruiter@example.com
     - Password: Test123!
     - Phone: 5559876543
     - Company: Tech Corp
   - Click "Create Account"
   - Should redirect to Recruiter Dashboard

### Login Test

1. Go to http://localhost:5173/login
2. Enter credentials:
   - Email: student@example.com
   - Password: Test123!
3. Click "Sign In"
4. Should show Student Dashboard

### Job Posting Test (Recruiter)

1. Login as recruiter
2. Click "Post New Job"
3. Fill in job details:
   - Title: Senior React Developer
   - Location: San Francisco, CA
   - Salary: 180000
   - Description: Detailed job description
   - Skills: React, JavaScript, TypeScript
4. Click "Post Job"
5. Should see job in dashboard

### Job Search Test (Student)

1. Login as student
2. Click "Search Jobs"
3. You should see the posted job
4. Click "View Details"
5. Click "Apply Now"
6. Fill in application details
7. Click "Submit Application"

## PART 6: Troubleshooting

### Frontend Issues

**Port 5173 already in use:**
```bash
# Find and kill the process
lsof -i :5173
kill -9 <PID>

# Or use a different port
npm run dev -- --port 3000
```

**Dependencies not installing:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Blank screen after loading:**
- Check browser console (F12) for errors
- Verify backend is running
- Check CORS configuration

### Backend Issues

**Port 8080 already in use:**
```bash
# Change port in application.properties
server.port=8081
```

**MongoDB connection error:**
```
com.mongodb.MongoServerSelectionException
```
- Verify MongoDB is running
- Check connection string is correct
- Verify username/password
- Check firewall settings (for Atlas, whitelist your IP)

**JWT Token error:**
- Ensure JWT secret is configured
- Check token format in Authorization header: `Bearer {token}`

**Build errors:**
```bash
# Clean and rebuild
mvn clean install -DskipTests
```

## PART 7: API Testing

### Using cURL

**Signup:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "Test123!",
    "phone": "5551234567",
    "role": "STUDENT"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test123!"
  }'
```

**Get Jobs:**
```bash
curl -X GET http://localhost:8080/api/jobs
```

### Using Postman

1. Download Postman from https://www.postman.com
2. Create a new collection "TalentFlow AI"
3. Create requests for each endpoint
4. Set base URL: `{{baseUrl}}/api`
5. Use environment variables for token management

## PART 8: Deployment

### Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Build frontend
cd frontend
npm run build

# Deploy
vercel
```

### Deploy Backend (Railway.app)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

## PART 9: Production Checklist

- [ ] Update JWT secret to a long random string
- [ ] Enable HTTPS only
- [ ] Configure proper CORS origins
- [ ] Set up environment variables
- [ ] Enable MongoDB authentication
- [ ] Set up logging and monitoring
- [ ] Configure database backups
- [ ] Set up error tracking (Sentry)
- [ ] Enable rate limiting
- [ ] Test all user flows

## PART 10: First-Time User Guide

### For Job Seekers:

1. **Create Profile**
   - Go to Profile page
   - Add skills, education, and experience
   - Upload resume (PDF)
   - Complete profile 100%

2. **Search Jobs**
   - Browse all jobs
   - Use filters (skills, location, salary)
   - View detailed job descriptions

3. **Apply to Jobs**
   - Click "Apply Now"
   - Resume auto-attaches
   - Add cover letter (optional)
   - Submit application

4. **Track Applications**
   - Go to "My Applications"
   - See match score for each application
   - Track status (Applied, Shortlisted, Selected, Rejected)

### For Recruiters:

1. **Setup Company**
   - Edit profile to add company details
   - Add company description
   - Add company logo

2. **Post Jobs**
   - Click "Post New Job"
   - Fill in all details
   - Add required skills
   - Post the job

3. **Review Applicants**
   - Go to applicants dashboard
   - View applicant profiles
   - Download resumes
   - Check match scores

4. **Manage Candidates**
   - Shortlist promising candidates
   - Schedule interviews
   - Select or reject candidates
   - Send feedback

---

## Support & Resources

- **Documentation**: See README.md for full documentation
- **API Docs**: See API documentation section in README.md
- **GitHub Issues**: Report bugs and request features
- **Email**: support@talentflow-ai.com

Happy coding! 🚀
