package com.talentflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobRequest {
    private String title;
    private String description;
    private String location;
    private Long salary;
    private String jobType;
    private Integer experienceRequired;
    private List<String> requiredSkills;
    private List<String> requirements;
}
