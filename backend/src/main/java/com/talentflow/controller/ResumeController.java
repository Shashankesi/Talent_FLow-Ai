package com.talentflow.controller;

import com.talentflow.entity.Resume;
import com.talentflow.security.JwtTokenProvider;
import com.talentflow.service.AuthService;
import com.talentflow.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ResumeController {

    private final ResumeService resumeService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthService authService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam MultipartFile file) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtTokenProvider.getEmailFromToken(token);
            String userId = authService.findByEmail(email).orElseThrow().getId();

            Resume resume = resumeService.uploadResume(userId, file);
            return ResponseEntity.ok(resume);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Failed to upload resume: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getResume(@PathVariable String id) {
        try {
            Resume resume = resumeService.getResume(id);
            return ResponseEntity.ok(resume);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/parse")
    public ResponseEntity<?> parseResume(@PathVariable String id) {
        try {
            Resume resume = resumeService.parseResume(id);
            return ResponseEntity.ok(Map.of(
                "skills", resume.getExtractedSkills(),
                "education", resume.getExtractedEducation(),
                "experience", resume.getExtractedExperience()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "Failed to parse resume: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/user/latest")
    public ResponseEntity<?> getUserLatestResume(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtTokenProvider.getEmailFromToken(token);
            String userId = authService.findByEmail(email).orElseThrow().getId();

            Resume resume = resumeService.getUserLatestResume(userId);
            return ResponseEntity.ok(resume);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadResume(@PathVariable String id) {
        try {
            Resume resume = resumeService.getResume(id);
            if (resume.getFileData() == null || resume.getFileData().length == 0) {
                return ResponseEntity.badRequest().body(Map.of("message", "Resume file is not available"));
            }

            ByteArrayResource resource = new ByteArrayResource(resume.getFileData());
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resume.getFilename() + "\"")
                    .contentLength(resume.getFileData().length)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
