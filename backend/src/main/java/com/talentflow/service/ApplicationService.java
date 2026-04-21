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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

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

        Application savedApplication = applicationRepository.save(application);
        
        // Send notification to recruiter
        notificationService.createApplicationNotification(job.getRecruiterId(), userId, "APPLIED", jobId, job.getTitle());

        return savedApplication;
    }

    public boolean hasAlreadyApplied(String jobId, String userId) {
        List<Application> existing = applicationRepository.findByUserIdAndJobId(userId, jobId);
        return !existing.isEmpty();
    }

    public List<Application> getApplicationsByUser(String userId) {
        return applicationRepository.findByUserId(userId);
    }

    public List<?> getApplicationsWithJobDetailsForUser(String userId) {
        return getApplicationsByUser(userId).stream()
                .map(app -> new ApplicationWithJobDTO(app, jobRepository.findById(app.getJobId()).orElse(null)))
                .collect(Collectors.toList());
    }

    public List<Application> getApplicationsByJob(String jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public List<?> getApplicationsWithUserDetailsForJob(String jobId) {
        return getApplicationsByJob(jobId).stream()
            .map(app -> {
                User user = userRepository.findById(app.getUserId()).orElse(null);
                return new ApplicationWithUserDTO(app, user);
            })
            .collect(Collectors.toList());
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
        
        // Send notification to student
        notificationService.createApplicationNotification(app.getUserId(), job.getRecruiterId(), "SHORTLISTED", app.getJobId(), job.getTitle());
    }

    public void selectCandidate(String applicationId) {
        Application app = applicationRepository.findById(applicationId).orElseThrow();
        app.setStatus("SELECTED");
        app.setSelectedAt(LocalDateTime.now());
        app.setUpdatedAt(LocalDateTime.now());
        applicationRepository.save(app);
        
        // Send notification to student
        Job job = jobRepository.findById(app.getJobId()).orElseThrow();
        notificationService.createApplicationNotification(app.getUserId(), job.getRecruiterId(), "SELECTED", app.getJobId(), job.getTitle());
    }

    public void rejectCandidate(String applicationId) {
        Application app = applicationRepository.findById(applicationId).orElseThrow();
        app.setStatus("REJECTED");
        app.setRejectedAt(LocalDateTime.now());
        app.setUpdatedAt(LocalDateTime.now());
        applicationRepository.save(app);
        
        // Send notification to student
        Job job = jobRepository.findById(app.getJobId()).orElseThrow();
        notificationService.createApplicationNotification(app.getUserId(), job.getRecruiterId(), "REJECTED", app.getJobId(), job.getTitle());
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

    // DTO for returning applications with user details
    public static class ApplicationWithUserDTO {
        public String id;
        public String jobId;
        public String userId;
        public String coverLetter;
        public String resumeId;
        public String status;
        public int matchScore;
        public LocalDateTime appliedAt;
        public LocalDateTime createdAt;
        public LocalDateTime updatedAt;
        public UserInfo user;

        public ApplicationWithUserDTO(Application app, User user) {
            this.id = app.getId();
            this.jobId = app.getJobId();
            this.userId = app.getUserId();
            this.coverLetter = app.getCoverLetter();
            this.resumeId = app.getResumeId();
            this.status = app.getStatus();
            this.matchScore = app.getMatchScore();
            this.appliedAt = app.getAppliedAt();
            this.createdAt = app.getCreatedAt();
            this.updatedAt = app.getUpdatedAt();
            
            if (user != null) {
                this.user = new UserInfo(user);
            }
        }
    }

    public static class ApplicationWithJobDTO {
        public String id;
        public String jobId;
        public String userId;
        public String coverLetter;
        public String resumeId;
        public String status;
        public int matchScore;
        public LocalDateTime appliedAt;
        public LocalDateTime createdAt;
        public LocalDateTime updatedAt;
        public JobInfo job;

        public ApplicationWithJobDTO(Application app, Job job) {
            this.id = app.getId();
            this.jobId = app.getJobId();
            this.userId = app.getUserId();
            this.coverLetter = app.getCoverLetter();
            this.resumeId = app.getResumeId();
            this.status = app.getStatus();
            this.matchScore = app.getMatchScore();
            this.appliedAt = app.getAppliedAt();
            this.createdAt = app.getCreatedAt();
            this.updatedAt = app.getUpdatedAt();
            if (job != null) {
                this.job = new JobInfo(job);
            }
        }
    }

    public static class UserInfo {
        public String id;
        public String fullName;
        public String email;
        public String phone;
        public List<String> skills;

        public UserInfo(User user) {
            this.id = user.getId();
            this.fullName = user.getFullName();
            this.email = user.getEmail();
            this.phone = user.getPhone();
            this.skills = user.getSkills();
        }
    }

    public static class JobInfo {
        public String id;
        public String title;
        public String companyName;
        public String location;
        public Long salary;

        public JobInfo(Job job) {
            this.id = job.getId();
            this.title = job.getTitle();
            this.companyName = job.getCompanyName();
            this.location = job.getLocation();
            this.salary = job.getSalary();
        }
    }
}
