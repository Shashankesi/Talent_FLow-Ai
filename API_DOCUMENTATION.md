# TalentFlow AI - Complete API Documentation

Base URL: `http://localhost:8080/api`

## Table of Contents
1. [Authentication](#authentication)
2. [Jobs](#jobs)
3. [Applications](#applications)
4. [Recruiter](#recruiter)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Examples](#examples)

---

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer {token}
```

### Signup

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "phone": "+1 (555) 000-0000",
  "role": "STUDENT",
  "companyName": "Tech Corp",
  "companyWebsite": "https://techcorp.com"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "role": "STUDENT",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 000-0000",
    "skills": [],
    "profileCompletion": 40.0
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Email already registered"
}
```

**Status Codes:**
- `200 OK` - User created successfully
- `400 Bad Request` - Invalid input or email already exists
- `500 Internal Server Error` - Server error

---

### Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "role": "STUDENT",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 000-0000",
    "profileCompletion": 85.0
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid email or password"
}
```

**Status Codes:**
- `200 OK` - Login successful
- `401 Unauthorized` - Invalid credentials
- `500 Internal Server Error` - Server error

---

### Get Profile

**Endpoint:** `GET /auth/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 000-0000",
  "role": "STUDENT",
  "skills": ["React", "JavaScript", "MongoDB"],
  "education": "B.S. in Computer Science",
  "experience": "5 years as Full Stack Developer",
  "resumeId": "resume_507f1f77bcf86cd799439012",
  "profileCompletion": 85.0
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Unauthorized"
}
```

**Status Codes:**
- `200 OK` - Profile retrieved
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found

---

### Update Profile

**Endpoint:** `PUT /auth/profile`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phone": "+1 (555) 111-2222",
  "skills": ["React", "JavaScript", "TypeScript", "MongoDB"],
  "education": "B.S. in Computer Science (2020)",
  "experience": "Senior React Developer at Tech Corp (2020-2024)"
}
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 111-2222",
  "role": "STUDENT",
  "skills": ["React", "JavaScript", "TypeScript", "MongoDB"],
  "education": "B.S. in Computer Science (2020)",
  "experience": "Senior React Developer at Tech Corp (2020-2024)",
  "profileCompletion": 95.0
}
```

**Status Codes:**
- `200 OK` - Profile updated
- `400 Bad Request` - Invalid data
- `401 Unauthorized` - Invalid token

---

## Jobs

### Get All Jobs

**Endpoint:** `GET /jobs`

**Query Parameters:**
```
None (public endpoint)
```

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "title": "Senior React Developer",
    "companyName": "Tech Corp",
    "companyDescription": "Leading tech company",
    "companyWebsite": "https://techcorp.com",
    "location": "San Francisco, CA",
    "salary": 180000,
    "jobType": "Full Time",
    "experienceRequired": 5,
    "description": "We are looking for an experienced React developer...",
    "requiredSkills": ["React", "JavaScript", "TypeScript"],
    "requirements": ["5+ years experience", "Strong React skills"],
    "applicantCount": 25,
    "shortlistedCount": 5,
    "isClosed": false,
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Jobs retrieved

---

### Get Job by ID

**Endpoint:** `GET /jobs/{jobId}`

**Path Parameters:**
- `jobId` (string, required) - MongoDB object ID

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439013",
  "title": "Senior React Developer",
  "companyName": "Tech Corp",
  "companyDescription": "Leading tech company...",
  "companyWebsite": "https://techcorp.com",
  "location": "San Francisco, CA",
  "salary": 180000,
  "jobType": "Full Time",
  "experienceRequired": 5,
  "description": "Detailed job description...",
  "requiredSkills": ["React", "JavaScript", "TypeScript"],
  "requirements": ["5+ years experience", "Strong React skills"],
  "applicantCount": 25,
  "shortlistedCount": 5,
  "isClosed": false,
  "createdAt": "2024-01-01T10:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Job retrieved
- `404 Not Found` - Job not found

---

### Search Jobs

**Endpoint:** `GET /jobs/search`

**Query Parameters:**
- `keyword` (string, required) - Search term (title or location)

**Example:**
```
GET /jobs/search?keyword=react
```

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "title": "Senior React Developer",
    "companyName": "Tech Corp",
    "location": "San Francisco, CA",
    "salary": 180000,
    "requiredSkills": ["React", "JavaScript", "TypeScript"],
    "applicantCount": 25
  }
]
```

**Status Codes:**
- `200 OK` - Search results retrieved
- `400 Bad Request` - Missing keyword parameter

---

### Get Trending Jobs

**Endpoint:** `GET /jobs/trending`

**Query Parameters:**
```
None
```

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "title": "Senior React Developer",
    "companyName": "Tech Corp",
    "location": "San Francisco, CA",
    "salary": 180000,
    "applicantCount": 150,
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Trending jobs retrieved

---

## Applications

### Apply for Job

**Endpoint:** `POST /applications/apply`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Query Parameters:**
- `jobId` (string, required) - Job ID to apply for
- `resumeId` (string, optional) - Resume ID
- `coverLetter` (string, optional) - Cover letter text

**Form Data:**
```
jobId=507f1f77bcf86cd799439013
resumeId=resume_507f1f77bcf86cd799439012
coverLetter=I am very interested in this position...
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439014",
  "jobId": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439011",
  "status": "APPLIED",
  "matchScore": 92,
  "coverLetter": "I am very interested in this position...",
  "resumeId": "resume_507f1f77bcf86cd799439012",
  "appliedAt": "2024-01-05T10:30:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Already applied to this job"
}
```

**Status Codes:**
- `200 OK` - Application created
- `400 Bad Request` - Already applied or invalid job
- `401 Unauthorized` - Invalid token

---

### Get My Applications

**Endpoint:** `GET /applications/my-applications`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439014",
    "jobId": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "status": "SHORTLISTED",
    "matchScore": 92,
    "coverLetter": "I am very interested...",
    "resumeId": "resume_507f1f77bcf86cd799439012",
    "notes": "Great React experience",
    "appliedAt": "2024-01-05T10:30:00Z",
    "shortlistedAt": "2024-01-06T14:00:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Applications retrieved
- `401 Unauthorized` - Invalid token

---

### Get Application by ID

**Endpoint:** `GET /applications/{applicationId}`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `applicationId` (string, required) - Application ID

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439014",
  "jobId": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439011",
  "status": "SHORTLISTED",
  "matchScore": 92,
  "coverLetter": "I am very interested...",
  "resumeId": "resume_507f1f77bcf86cd799439012",
  "notes": "Great React experience",
  "appliedAt": "2024-01-05T10:30:00Z"
}
```

**Status Codes:**
- `200 OK` - Application retrieved
- `404 Not Found` - Application not found
- `401 Unauthorized` - Invalid token

---

### Update Application Status

**Endpoint:** `PUT /applications/{applicationId}/status`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Path Parameters:**
- `applicationId` (string, required) - Application ID

**Request Body:**
```json
{
  "status": "SHORTLISTED"
}
```

**Status Values:**
- `APPLIED` - Initial application state
- `SHORTLISTED` - Candidate shortlisted
- `INTERVIEW` - Interview scheduled
- `SELECTED` - Candidate selected
- `REJECTED` - Application rejected

**Response (200 OK):**
```json
{
  "message": "Status updated"
}
```

**Status Codes:**
- `200 OK` - Status updated
- `400 Bad Request` - Invalid status
- `401 Unauthorized` - Invalid token

---

## Recruiter

### Create Job

**Endpoint:** `POST /recruiter/jobs`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Senior React Developer",
  "description": "We are looking for an experienced React developer to join our team...",
  "location": "San Francisco, CA",
  "salary": 180000,
  "experienceRequired": 5,
  "jobType": "Full Time",
  "requiredSkills": ["React", "JavaScript", "TypeScript", "Node.js"],
  "requirements": [
    "5+ years of web development experience",
    "Strong React and JavaScript skills",
    "Experience with REST APIs",
    "Excellent problem-solving abilities"
  ]
}
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439013",
  "title": "Senior React Developer",
  "description": "We are looking for...",
  "location": "San Francisco, CA",
  "salary": 180000,
  "experienceRequired": 5,
  "jobType": "Full Time",
  "requiredSkills": ["React", "JavaScript", "TypeScript", "Node.js"],
  "applicantCount": 0,
  "shortlistedCount": 0,
  "isClosed": false,
  "createdAt": "2024-01-01T10:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Job created
- `400 Bad Request` - Invalid data
- `401 Unauthorized` - Invalid token

---

### Get My Jobs

**Endpoint:** `GET /recruiter/my-jobs`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "title": "Senior React Developer",
    "location": "San Francisco, CA",
    "salary": 180000,
    "applicantCount": 25,
    "shortlistedCount": 5,
    "isClosed": false,
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Jobs retrieved
- `401 Unauthorized` - Invalid token

---

### Get Job Applicants

**Endpoint:** `GET /recruiter/jobs/{jobId}/applicants`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `jobId` (string, required) - Job ID

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439014",
    "jobId": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "status": "APPLIED",
    "matchScore": 92,
    "appliedAt": "2024-01-05T10:30:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Applicants retrieved
- `404 Not Found` - Job not found
- `401 Unauthorized` - Invalid token

---

### Shortlist Candidate

**Endpoint:** `PUT /recruiter/applications/{applicationId}/shortlist`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `applicationId` (string, required) - Application ID

**Response (200 OK):**
```json
{
  "message": "Candidate shortlisted"
}
```

**Status Codes:**
- `200 OK` - Candidate shortlisted
- `404 Not Found` - Application not found
- `401 Unauthorized` - Invalid token

---

### Select Candidate

**Endpoint:** `PUT /recruiter/applications/{applicationId}/select`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `applicationId` (string, required) - Application ID

**Response (200 OK):**
```json
{
  "message": "Candidate selected"
}
```

**Status Codes:**
- `200 OK` - Candidate selected
- `404 Not Found` - Application not found
- `401 Unauthorized` - Invalid token

---

### Reject Candidate

**Endpoint:** `PUT /recruiter/applications/{applicationId}/reject`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `applicationId` (string, required) - Application ID

**Response (200 OK):**
```json
{
  "message": "Candidate rejected"
}
```

**Status Codes:**
- `200 OK` - Candidate rejected
- `404 Not Found` - Application not found
- `401 Unauthorized` - Invalid token

---

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "message": "Invalid request data or parameters"
}
```

**401 Unauthorized:**
```json
{
  "message": "Missing or invalid authentication token"
}
```

**403 Forbidden:**
```json
{
  "message": "You don't have permission to access this resource"
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "An error occurred processing your request"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. In production, recommended limits:
- Authentication endpoints: 5 requests per minute
- Search endpoints: 30 requests per minute
- Job posting: 10 requests per hour
- Application endpoints: 20 requests per minute

---

## Examples

### Complete Signup and Login Flow

```bash
# 1. Signup as Student
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "Test123!",
    "phone": "5551234567",
    "role": "STUDENT"
  }'

# Response includes token
# Token: eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...

# 2. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Test123!"
  }'

# 3. Get Profile (use token from signup/login)
curl -X GET http://localhost:8080/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."

# 4. Update Profile
curl -X PUT http://localhost:8080/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["React", "JavaScript", "MongoDB"],
    "education": "B.S. in Computer Science"
  }'
```

### Job Search Flow

```bash
# 1. Get all jobs
curl -X GET http://localhost:8080/api/jobs

# 2. Search jobs by keyword
curl -X GET "http://localhost:8080/api/jobs/search?keyword=react"

# 3. Get trending jobs
curl -X GET http://localhost:8080/api/jobs/trending

# 4. Get specific job details
curl -X GET http://localhost:8080/api/jobs/507f1f77bcf86cd799439013
```

### Job Application Flow

```bash
# 1. Apply for job (as student with token)
curl -X POST "http://localhost:8080/api/applications/apply?jobId=507f1f77bcf86cd799439013" \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..." \
  -d 'coverLetter=I am interested in this role'

# 2. View my applications
curl -X GET http://localhost:8080/api/applications/my-applications \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."
```

### Recruiter Job Posting Flow

```bash
# 1. Create job (as recruiter with token)
curl -X POST http://localhost:8080/api/recruiter/jobs \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior React Developer",
    "description": "Detailed job description...",
    "location": "San Francisco, CA",
    "salary": 180000,
    "experienceRequired": 5,
    "jobType": "Full Time",
    "requiredSkills": ["React", "JavaScript"],
    "requirements": ["5+ years experience"]
  }'

# 2. View my posted jobs
curl -X GET http://localhost:8080/api/recruiter/my-jobs \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."

# 3. View applicants for a job
curl -X GET "http://localhost:8080/api/recruiter/jobs/507f1f77bcf86cd799439013/applicants" \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."

# 4. Shortlist candidate
curl -X PUT "http://localhost:8080/api/recruiter/applications/507f1f77bcf86cd799439014/shortlist" \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."

# 5. Select candidate
curl -X PUT "http://localhost:8080/api/recruiter/applications/507f1f77bcf86cd799439014/select" \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."
```

---

## API Versioning

Current API Version: `v1` (embedded in base URL)
Future versions will use `/api/v2/` etc.

---

## CORS Settings

Allowed Origins: `*` (development), configure for production
Allowed Methods: `GET, POST, PUT, DELETE, OPTIONS`
Allowed Headers: `Authorization, Content-Type`
Max Age: 3600 seconds

---

## Authentication Token Details

- **Algorithm**: HMAC-SHA512
- **Expiration**: 24 hours (86400000 milliseconds)
- **Format**: JWT (JSON Web Token)
- **Payload**: User email

---

**Last Updated**: January 2024
**API Stability**: Beta
**Support**: support@talentflow-ai.com
