package com.talentflow.service;

import com.talentflow.entity.Application;
import com.talentflow.entity.Job;
import com.talentflow.entity.User;
import com.talentflow.repository.ApplicationRepository;
import com.talentflow.repository.JobRepository;
import com.talentflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public Application createApplication(String jobId, String userId, String coverLetter, String resumeId) {
        // Check if already applied
        List<Application> existing = applicationRepository.findByUserIdAndJobId(userId, jobId);
        if (!existing.isEmpty()) {
            throw new RuntimeException("Already applied for this job");
        }

        Application application = new Application();
        application.setJobId(jobId);
        application.setUserId(userId);
        application.setCoverLetter(coverLetter);
        application.setResumeId(resumeId);
        application.setStatus("APPLIED");
        application.setAppliedAt(LocalDateTime.now());
        application.setCreatedAt(LocalDateTime.now());
        application.setUpdatedAt(LocalDateTime.now());

        // Calculate match score
        User user = userRepository.findById(userId).orElseThrow();
        Job job = jobRepository.findById(jobId).orElseThrow();
        
        int matchScore = calculateMatchScore(user, job);
        application.setMatchScore(matchScore);

        // Update job applicant count
        job.setApplicantCount(job.getApplicantCount() + 1);
        jobRepository.save(job);

        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByUser(String userId) {
        return applicationRepository.findByUserId(userId);
    }

    public List<Application> getApplicationsByJob(String jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public Application getApplicationById(String id) {
        return applicationRepository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
    }

    public void shortlistCandidate(String applicationId) {
        Application app = applicationRepository.findById(applicationId).orElseThrow();
        app.setStatus("SHORTLISTED");
        app.setShortlistedAt(LocalDateTime.now());
        app.setUpdatedAt(LocalDateTime.now());

        Job job = jobRepository.findById(app.getJobId()).orElseThrow();
        job.setShortlistedCount(job.getShortlistedCount() + 1);
        jobRepository.save(job);

        applicationRepository.save(app);
    }

    public void selectCandidate(String applicationId) {
        Application app = applicationRepository.findById(applicationId).orElseThrow();
        app.setStatus("SELECTED");
        app.setSelectedAt(LocalDateTime.now());
        app.setUpdatedAt(LocalDateTime.now());
        applicationRepository.save(app);
    }

    public void rejectCandidate(String applicationId) {
        Application app = applicationRepository.findById(applicationId).orElseThrow();
        app.setStatus("REJECTED");
        app.setRejectedAt(LocalDateTime.now());
        app.setUpdatedAt(LocalDateTime.now());
        applicationRepository.save(app);
    }

    public void updateApplicationStatus(String applicationId, String status) {
        Application app = applicationRepository.findById(applicationId).orElseThrow();
        app.setStatus(status);
        app.setUpdatedAt(LocalDateTime.now());
        applicationRepository.save(app);
    }

    private int calculateMatchScore(User user, Job job) {
        if (user.getSkills() == null || job.getRequiredSkills() == null) {
            return 0;
        }

        int matched = 0;
        for (String skill : job.getRequiredSkills()) {
            if (user.getSkills().stream()
                    .anyMatch(s -> s.equalsIgnoreCase(skill))) {
                matched++;
            }
        }

        return Math.round((matched * 100) / (float) job.getRequiredSkills().size());
    }
}
