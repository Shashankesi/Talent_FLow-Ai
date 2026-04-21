package com.talentflow.controller;

import com.talentflow.dto.CreateJobRequest;
import com.talentflow.dto.JobDTO;
import com.talentflow.security.JwtTokenProvider;
import com.talentflow.service.ApplicationService;
import com.talentflow.service.AuthService;
import com.talentflow.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class RecruiterController {

    private final JobService jobService;
    private final ApplicationService applicationService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthService authService;

    @PostMapping("/jobs")
    public ResponseEntity<?> createJob(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateJobRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtTokenProvider.getEmailFromToken(token);
            var user = authService.findByEmail(email).orElseThrow();
            if (!"RECRUITER".equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Only recruiters can post jobs"));
            }

            JobDTO jobDTO = new JobDTO();
            var job = jobService.createJob(user.getId(), request, user.getCompanyName());
            
            jobDTO.setId(job.getId());
            jobDTO.setTitle(job.getTitle());
            jobDTO.setDescription(job.getDescription());
            jobDTO.setLocation(job.getLocation());
            jobDTO.setSalary(job.getSalary());
            jobDTO.setJobType(job.getJobType());
            jobDTO.setExperienceRequired(job.getExperienceRequired());
            jobDTO.setRequiredSkills(job.getRequiredSkills());

            return ResponseEntity.ok(jobDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<List<JobDTO>> getMyJobs(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtTokenProvider.getEmailFromToken(token);
            var user = authService.findByEmail(email).orElseThrow();
            if (!"RECRUITER".equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            String userId = user.getId();
            return ResponseEntity.ok(jobService.getJobsByRecruiter(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/jobs/{jobId}/applicants")
    public ResponseEntity<?> getApplicants(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String jobId) {
        try {
            validateRecruiter(authHeader);
            return ResponseEntity.ok(applicationService.getApplicationsWithUserDetailsForJob(jobId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/applications/{appId}/shortlist")
    public ResponseEntity<?> shortlistCandidate(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String appId) {
        try {
            validateRecruiter(authHeader);
            applicationService.shortlistCandidate(appId);
            return ResponseEntity.ok(Map.of("message", "Candidate shortlisted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/applications/{appId}/select")
    public ResponseEntity<?> selectCandidate(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String appId) {
        try {
            validateRecruiter(authHeader);
            applicationService.selectCandidate(appId);
            return ResponseEntity.ok(Map.of("message", "Candidate selected"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/applications/{appId}/reject")
    public ResponseEntity<?> rejectCandidate(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String appId) {
        try {
            validateRecruiter(authHeader);
            applicationService.rejectCandidate(appId);
            return ResponseEntity.ok(Map.of("message", "Candidate rejected"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    private void validateRecruiter(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = jwtTokenProvider.getEmailFromToken(token);
        var user = authService.findByEmail(email).orElseThrow();
        if (!"RECRUITER".equals(user.getRole())) {
            throw new RuntimeException("Only recruiters can perform this action");
        }
    }
}
