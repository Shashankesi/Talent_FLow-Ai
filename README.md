🚀 TalentFlow AI – Smart Job Portal with Recruitment Automation

TalentFlow AI is a full-stack job portal system that connects job seekers and recruiters with intelligent automation. The platform allows users to search and apply for jobs, while recruiters can manage applications and shortlist candidates efficiently.

🌟 Features
👨‍🎓 For Job Seekers (Students)
User registration & login (role-based)
Create and manage profile
Upload resume (PDF)
Search jobs using keywords and filters
Apply for jobs in one click
Track application status
🧑‍💼 For Recruiters
Recruiter registration & login
Post job openings
View applicants for each job
Access candidate details & resumes
Shortlist candidates easily
🤖 Smart Automation
Resume-based application handling
Centralized dashboard for both roles
Clean UI for better user experience
🛠️ Tech Stack
Frontend:
React.js (Vite)
Tailwind CSS / Custom CSS
Backend:
Java Spring Boot
REST APIs
Database:
MongoDB Atlas (Cloud Database)
Deployment:
Render
📁 Project Structure
TalentFlow-AI/
├── backend/        # Spring Boot backend
│   ├── src/
│   ├── pom.xml
│   └── application.properties
├── frontend/       # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md
⚙️ Setup Instructions
🔹 1. Clone Repository
git clone https://github.com/Shashankesi/TalentFlow-AI.git
cd TalentFlow-AI
🔹 2. Backend Setup (Spring Boot)
cd backend
mvn clean install
mvn spring-boot:run
🔹 3. Frontend Setup (React)
cd frontend
npm install
npm run dev
🔐 Environment Variables

Create .env file in backend or use deployment variables:

SPRING_DATA_MONGODB_URI=your_mongodb_connection_string
🌐 Deployment (Render)
Backend:
Service Type: Web Service
Root Directory: backend
Build Command: mvn clean package
Start Command: java -jar target/*.jar
Frontend:
Service Type: Static Site
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist

📧 Contact

Shashank Kumar

GitHub: https://github.com/Shashankesi
Email: shashankesi224@gmail.com

⭐ Support

If you like this project, please ⭐ star the repository!
