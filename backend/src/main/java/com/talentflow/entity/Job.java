package com.talentflow.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    @Id
    private String id;
    
    private String recruiterId;
    private String companyName;
    private String companyDescription;
    private String companyWebsite;
    private String companyLogo;
    
    private String title;
    private String description;
    private String location;
    private Long salary;
    private String jobType; // Full Time, Part Time, Contract, Remote
    private Integer experienceRequired;
    
    private List<String> requiredSkills;
    private List<String> requirements;
    
    private Integer applicantCount = 0;
    private Integer shortlistedCount = 0;
    
    private Boolean isClosed = false;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
