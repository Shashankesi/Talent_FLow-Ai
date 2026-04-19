package com.talentflow.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private String id;
    
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String role; // STUDENT or RECRUITER
    
    // For Students
    private List<String> skills;
    private String education;
    private String experience;
    private String resumeId;
    private String profilePhoto;
    private Double profileCompletion;
    
    // For Recruiters
    private String companyName;
    private String companyWebsite;
    private String companyDescription;
    private String companyLocation;
    
    private Boolean isActive = true;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
