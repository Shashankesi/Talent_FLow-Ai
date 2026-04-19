// MongoDB Collections Schema for TalentFlow AI

// ====== USERS COLLECTION ======
db.createCollection("users")

db.users.insertOne({
  _id: ObjectId(),
  fullName: "John Doe",
  email: "john@example.com",
  password: "$2a$10$...", // Hashed password
  phone: "+1 (555) 000-0000",
  role: "STUDENT", // STUDENT or RECRUITER
  
  // Student fields
  skills: ["React", "JavaScript", "MongoDB"],
  education: "B.S. in Computer Science from XYZ University (2020)",
  experience: "Senior React Developer at ABC Corp (2020-2023)",
  resumeId: "resume_id_123",
  profilePhoto: "photo_url",
  profileCompletion: 85.0,
  
  // Recruiter fields
  companyName: "Tech Company",
  companyWebsite: "https://techcompany.com",
  companyDescription: "Leading tech company",
  companyLocation: "San Francisco, CA",
  
  isActive: true,
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z")
})

// ====== JOBS COLLECTION ======
db.createCollection("jobs")

db.jobs.insertOne({
  _id: ObjectId(),
  recruiterId: "recruiter_user_id",
  companyName: "Tech Company",
  companyDescription: "Leading tech company",
  companyWebsite: "https://techcompany.com",
  companyLogo: "logo_url",
  
  title: "Senior React Developer",
  description: "We are looking for an experienced React developer...",
  location: "San Francisco, CA",
  salary: 180000,
  jobType: "Full Time",
  experienceRequired: 5,
  
  requiredSkills: ["React", "JavaScript", "TypeScript", "Node.js"],
  requirements: [
    "5+ years of web development experience",
    "Strong React and JavaScript skills",
    "Experience with REST APIs",
    "Excellent problem-solving abilities"
  ],
  
  applicantCount: 25,
  shortlistedCount: 5,
  isClosed: false,
  
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z")
})

// ====== APPLICATIONS COLLECTION ======
db.createCollection("applications")

db.applications.insertOne({
  _id: ObjectId(),
  jobId: "job_id_123",
  userId: "user_id_456",
  
  status: "SHORTLISTED", // APPLIED, SHORTLISTED, INTERVIEW, SELECTED, REJECTED
  matchScore: 92,
  coverLetter: "I am very interested in this position...",
  resumeId: "resume_id_123",
  notes: "Great experience with React projects",
  
  appliedAt: ISODate("2024-01-05T10:30:00Z"),
  shortlistedAt: ISODate("2024-01-06T14:00:00Z"),
  interviewAt: null,
  selectedAt: null,
  rejectedAt: null,
  
  createdAt: ISODate("2024-01-05T10:30:00Z"),
  updatedAt: ISODate("2024-01-06T14:00:00Z")
})

// ====== RESUMES COLLECTION ======
db.createCollection("resumes")

db.resumes.insertOne({
  _id: ObjectId(),
  userId: "user_id_456",
  filename: "john-doe-resume.pdf",
  fileUrl: "https://storage.example.com/resumes/john-doe-resume.pdf",
  fileSize: 256000,
  
  // Extracted data from resume
  extractedSkills: ["React", "JavaScript", "MongoDB", "Node.js", "AWS"],
  extractedEducation: "B.S. in Computer Science",
  extractedExperience: "10 years in software development",
  
  uploadedAt: ISODate("2024-01-01T12:00:00Z"),
  updatedAt: ISODate("2024-01-01T12:00:00Z")
})

// ====== INDEXES ======
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.jobs.createIndex({ recruiterId: 1 })
db.jobs.createIndex({ title: "text", description: "text" })
db.jobs.createIndex({ location: 1 })
db.jobs.createIndex({ isClosed: 1 })
db.applications.createIndex({ jobId: 1 })
db.applications.createIndex({ userId: 1 })
db.applications.createIndex({ jobId: 1, userId: 1 }, { unique: true })
db.applications.createIndex({ status: 1 })
db.resumes.createIndex({ userId: 1 }, { unique: true })
