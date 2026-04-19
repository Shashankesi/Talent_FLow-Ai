package com.talentflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobDTO {
    private String id;
    private String title;
    private String companyName;
    private String description;
    private String location;
    private Long salary;
    private String jobType;
    private Integer experienceRequired;
    private List<String> requiredSkills;
    private List<String> requirements;
    private String companyDescription;
    private String companyWebsite;
    private String companyLogo;
    private Integer applicantCount;
    private Integer shortlistedCount;
    private java.time.LocalDateTime createdAt;
}
