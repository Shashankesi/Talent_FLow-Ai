package com.talentflow.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    private String id;
    
    private String userId;  // Recipient user ID
    private String senderId; // User who triggered the notification (optional)
    private String type; // APPLIED, SHORTLISTED, REJECTED, MESSAGE, etc.
    private String title;
    private String message;
    private String icon; // Icon class for UI
    
    // Reference IDs
    private String applicationId;
    private String jobId;
    private String jobTitle;
    
    // Additional data
    private String senderName;
    private String senderEmail;
    private String senderRole;
    
    private Boolean isRead = false;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}
