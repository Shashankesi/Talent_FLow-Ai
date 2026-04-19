package com.talentflow.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "resumes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resume {
    @Id
    private String id;
    
    private String userId;
    private String filename;
    private String fileUrl;
    private Long fileSize;
    
    // Extracted data
    private List<String> extractedSkills;
    private String extractedEducation;
    private String extractedExperience;
    
    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;
}
