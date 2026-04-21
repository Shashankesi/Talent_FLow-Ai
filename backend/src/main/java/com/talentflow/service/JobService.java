package com.talentflow.service;

import com.talentflow.dto.CreateJobRequest;
import com.talentflow.dto.JobDTO;
import com.talentflow.entity.Job;
import com.talentflow.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final JobRepository jobRepository;

    public Job createJob(String recruiterId, CreateJobRequest request, String companyName) {
        Job job = new Job();
        job.setRecruiterId(recruiterId);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setJobType(request.getJobType());
        job.setExperienceRequired(request.getExperienceRequired());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setRequirements(request.getRequirements());
        job.setCompanyName(companyName);
        job.setCreatedAt(LocalDateTime.now());
        job.setUpdatedAt(LocalDateTime.now());
        job.setIsClosed(false);
        job.setApplicantCount(0);
        job.setShortlistedCount(0);

        return jobRepository.save(job);
    }

    public JobDTO getJobById(String id) {
        log.info("🔍 Getting job with ID: {}", id);
        log.info("📊 Total jobs in DB: {}", jobRepository.count());
        Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found with ID: " + id));
        return convertToDTO(job);
    }

    public List<JobDTO> getAllJobs() {
        log.info("📋 Fetching all jobs...");
        List<JobDTO> jobs = jobRepository.findByIsClosed(false).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        log.info("✅ Found {} active jobs", jobs.size());
        return jobs;
    }

    public List<JobDTO> searchJobs(String keyword) {
        List<Job> byTitle = jobRepository.findByTitleContainingIgnoreCase(keyword);
        List<Job> byLocation = jobRepository.findByLocationContainingIgnoreCase(keyword);
        
        byTitle.addAll(byLocation);
        
        return byTitle.stream()
                .distinct()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobDTO> getJobsByRecruiter(String recruiterId) {
        return jobRepository.findByRecruiterId(recruiterId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<JobDTO> getTrendingJobs() {
        return jobRepository.findAll().stream()
                .sorted((j1, j2) -> Integer.compare(j2.getApplicantCount(), j1.getApplicantCount()))
                .limit(10)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private JobDTO convertToDTO(Job job) {
        JobDTO dto = new JobDTO();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setCompanyName(job.getCompanyName());
        dto.setDescription(job.getDescription());
        dto.setLocation(job.getLocation());
        dto.setSalary(job.getSalary());
        dto.setJobType(job.getJobType());
        dto.setExperienceRequired(job.getExperienceRequired());
        dto.setRequiredSkills(job.getRequiredSkills());
        dto.setRequirements(job.getRequirements());
        dto.setApplicantCount(job.getApplicantCount());
        dto.setShortlistedCount(job.getShortlistedCount());
        dto.setCreatedAt(job.getCreatedAt());
        return dto;
    }
}
