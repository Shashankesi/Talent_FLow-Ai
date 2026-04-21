package com.talentflow.controller;

import com.talentflow.dto.JobDTO;
import com.talentflow.security.JwtTokenProvider;
import com.talentflow.service.ApplicationService;
import com.talentflow.service.AuthService;
import com.talentflow.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class JobController {

    private final JobService jobService;
    private final ApplicationService applicationService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<JobDTO>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> getJobById(@PathVariable String id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobDTO>> searchJobs(@RequestParam String keyword) {
        return ResponseEntity.ok(jobService.searchJobs(keyword));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<JobDTO>> getTrendingJobs() {
        return ResponseEntity.ok(jobService.getTrendingJobs());
    }

    @GetMapping("/{id}/check-applied")
    public ResponseEntity<?> checkIfApplied(
            @PathVariable String id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.ok(Map.of("applied", false));
            }

            String token = authHeader.replace("Bearer ", "");
            String email = jwtTokenProvider.getEmailFromToken(token);
            String userId = authService.findByEmail(email).orElseThrow().getId();

            boolean applied = applicationService.hasAlreadyApplied(id, userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("applied", applied);
            response.put("jobId", id);
            response.put("userId", userId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("applied", false));
        }
    }
}
