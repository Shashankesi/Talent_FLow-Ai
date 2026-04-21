package com.talentflow.controller;

import com.talentflow.entity.Application;
import com.talentflow.entity.Resume;
import com.talentflow.security.JwtTokenProvider;
import com.talentflow.service.ApplicationService;
import com.talentflow.service.AuthService;
import com.talentflow.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ApplicationController {

    private final ApplicationService applicationService;
    private final ResumeService resumeService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthService authService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyForJob(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam String jobId,
            @RequestParam(required = false) MultipartFile resume,
            @RequestParam(required = false) String coverLetter) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtTokenProvider.getEmailFromToken(token);
            var user = authService.findByEmail(email).orElseThrow();
            if (!"STUDENT".equals(user.getRole())) {
                return ResponseEntity.status(403).body(Map.of("message", "Only students can apply for jobs"));
            }
            String userId = user.getId();

            // Upload resume if provided
            String resumeId = null;
            if (resume != null && !resume.isEmpty()) {
                Resume savedResume = resumeService.uploadResume(userId, resume);
                resumeId = savedResume.getId();
            }

            Application application = applicationService.createApplication(jobId, userId, coverLetter, resumeId);
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtTokenProvider.getEmailFromToken(token);
            var user = authService.findByEmail(email).orElseThrow();
            if (!"STUDENT".equals(user.getRole())) {
                return ResponseEntity.status(403).body(Map.of("message", "Only students can view their applications"));
            }
            String userId = user.getId();
            return ResponseEntity.ok(applicationService.getApplicationsWithJobDetailsForUser(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable String id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        try {
            String status = request.get("status");
            applicationService.updateApplicationStatus(id, status);
            return ResponseEntity.ok(Map.of("message", "Status updated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats/student")
    public ResponseEntity<?> getStudentStats(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtTokenProvider.getEmailFromToken(token);
            var user = authService.findByEmail(email).orElseThrow();
            String userId = user.getId();

            var applications = applicationService.getApplicationsByUser(userId);
            
            long totalApplied = applications.size();
            long shortlisted = applications.stream().filter(a -> "SHORTLISTED".equals(a.getStatus())).count();
            long rejected = applications.stream().filter(a -> "REJECTED".equals(a.getStatus())).count();
            long selected = applications.stream().filter(a -> "SELECTED".equals(a.getStatus())).count();
            long pending = applications.stream().filter(a -> "APPLIED".equals(a.getStatus())).count();
            
            Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("totalApplied", totalApplied);
            stats.put("shortlisted", shortlisted);
            stats.put("rejected", rejected);
            stats.put("selected", selected);
            stats.put("pending", pending);
            stats.put("successRate", totalApplied > 0 ? Math.round((selected * 100.0) / totalApplied) : 0);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/stats/recruiter/job/{jobId}")
    public ResponseEntity<?> getRecruiterJobStats(
            @PathVariable String jobId,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtTokenProvider.getEmailFromToken(token);
            authService.findByEmail(email).orElseThrow();

            var applications = applicationService.getApplicationsByJob(jobId);
            
            long totalApplications = applications.size();
            long shortlisted = applications.stream().filter(a -> "SHORTLISTED".equals(a.getStatus())).count();
            long rejected = applications.stream().filter(a -> "REJECTED".equals(a.getStatus())).count();
            long selected = applications.stream().filter(a -> "SELECTED".equals(a.getStatus())).count();
            long pending = applications.stream().filter(a -> "APPLIED".equals(a.getStatus())).count();
            
            Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("totalApplications", totalApplications);
            stats.put("shortlisted", shortlisted);
            stats.put("rejected", rejected);
            stats.put("selected", selected);
            stats.put("pending", pending);
            stats.put("conversionRate", totalApplications > 0 ? Math.round((selected * 100.0) / totalApplications) : 0);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
