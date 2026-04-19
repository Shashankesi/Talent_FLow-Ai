package com.talentflow.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {
    @Id
    private String id;
    
    private String jobId;
    private String userId;
    
    private String status; // APPLIED, SHORTLISTED, INTERVIEW, SELECTED, REJECTED
    private Integer matchScore;
    private String coverLetter;
    private String resumeId;
    private String notes;
    
    private LocalDateTime appliedAt;
    private LocalDateTime shortlistedAt;
    private LocalDateTime interviewAt;
    private LocalDateTime selectedAt;
    private LocalDateTime rejectedAt;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
