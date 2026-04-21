package com.talentflow.service;

import com.talentflow.entity.Resume;
import com.talentflow.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final AuthService authService;
    
    // Common programming skills for extraction
    private static final Set<String> COMMON_SKILLS = new HashSet<>(Arrays.asList(
        "Java", "Python", "JavaScript", "TypeScript", "C++", "C#", "PHP", "Ruby", "Go", "Rust", "Kotlin",
        "Spring Boot", "Spring", "Django", "Flask", "React", "Angular", "Vue.js", "Next.js",
        "Node.js", "Express", "Fastapi", "ASP.NET", "Laravel", "Ruby on Rails",
        "MongoDB", "PostgreSQL", "MySQL", "Oracle", "SQL Server", "Redis", "Elasticsearch",
        "Docker", "Kubernetes", "AWS", "Azure", "GCP", "GitHub", "GitLab", "Git",
        "REST API", "GraphQL", "SOAP", "Microservices", "Agile", "SCRUM", "Jenkins",
        "HTML", "CSS", "SASS", "Bootstrap", "Tailwind", "Material UI",
        "Machine Learning", "TensorFlow", "PyTorch", "Scikit-learn", "Data Science",
        "Linux", "Windows", "Unix", "Apache", "Nginx", "JWT", "OAuth",
        "API", "Database", "SQL", "NOSQL", "ORM", "MVC", "MVVM"
    ));

    public Resume uploadResume(String userId, MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (!file.getContentType().equals("application/pdf")) {
            throw new RuntimeException("Only PDF files are allowed");
        }

        if (file.getSize() > 10 * 1024 * 1024) { // 10MB limit
            throw new RuntimeException("File size exceeds 10MB limit");
        }

        // Create resume entity
        Resume resume = new Resume();
        resume.setUserId(userId);
        resume.setFilename(file.getOriginalFilename());
        resume.setFileSize(file.getSize());
        resume.setFileData(file.getBytes());
        
        resume.setFileUrl("/api/resumes/files/" + UUID.randomUUID() + ".pdf");
        
        resume.setUploadedAt(LocalDateTime.now());
        resume.setUpdatedAt(LocalDateTime.now());

        // Parse and extract skills
        parseResumeContent(resume, file);

        Resume savedResume = resumeRepository.save(resume);
        authService.updateResumeReference(userId, savedResume.getId());
        return savedResume;
    }

    public Resume getResume(String resumeId) {
        return resumeRepository.findById(resumeId)
            .orElseThrow(() -> new RuntimeException("Resume not found"));
    }

    public Resume getUserLatestResume(String userId) {
        return resumeRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("No resume found for user"));
    }

    public Resume parseResume(String resumeId) {
        Resume resume = getResume(resumeId);
        // Skills are already extracted during upload
        return resume;
    }

    private void parseResumeContent(Resume resume, MultipartFile file) throws IOException {
        try {
            String content = extractPdfText(file.getBytes());
            
            // Extract skills
            List<String> skills = extractSkills(content);
            resume.setExtractedSkills(skills);

            // Extract education (basic pattern matching)
            String education = extractEducation(content);
            resume.setExtractedEducation(education);

            // Extract experience (basic pattern matching)
            String experience = extractExperience(content);
            resume.setExtractedExperience(experience);
        } catch (IOException e) {
            // If parsing fails, just set empty values
            resume.setExtractedSkills(new ArrayList<>());
            resume.setExtractedEducation("");
            resume.setExtractedExperience("");
        }
    }

    private String extractPdfText(byte[] fileBytes) throws IOException {
        try (PDDocument document = PDDocument.load(fileBytes)) {
            return new PDFTextStripper().getText(document);
        }
    }

    private List<String> extractSkills(String content) {
        List<String> skills = new ArrayList<>();
        String lowerContent = content.toLowerCase();
        
        for (String skill : COMMON_SKILLS) {
            if (lowerContent.contains(skill.toLowerCase())) {
                skills.add(skill);
            }
        }
        
        return skills;
    }

    private String extractEducation(String content) {
        // Pattern for common degree types
        Pattern pattern = Pattern.compile(
            "(bachelor|master|phd|diploma|degree|b\\.?s|m\\.?s|b\\.?a|m\\.?a|m\\.?tech|b\\.?tech).*?(university|college|institute|school)",
            Pattern.CASE_INSENSITIVE
        );
        
        Matcher matcher = pattern.matcher(content);
        if (matcher.find()) {
            return matcher.group().trim();
        }
        
        return "Not specified";
    }

    private String extractExperience(String content) {
        // Pattern for work experience
        Pattern pattern = Pattern.compile(
            "(worked|developer|engineer|consultant|manager|lead|architect|analyst).*?(company|organization|corporation|ltd|inc)",
            Pattern.CASE_INSENSITIVE
        );
        
        Matcher matcher = pattern.matcher(content);
        if (matcher.find()) {
            return matcher.group().trim();
        }
        
        return "Not specified";
    }

    public void deleteResume(String resumeId) {
        resumeRepository.deleteById(resumeId);
    }
}
