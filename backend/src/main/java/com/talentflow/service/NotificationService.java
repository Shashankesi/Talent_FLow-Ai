package com.talentflow.service;

import com.talentflow.entity.Notification;
import com.talentflow.entity.User;
import com.talentflow.repository.NotificationRepository;
import com.talentflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public Notification createNotification(String userId, String type, String title, String message, String icon, String applicationId, String jobId, String jobTitle) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setIcon(icon);
        notification.setApplicationId(applicationId);
        notification.setJobId(jobId);
        notification.setJobTitle(jobTitle);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        return notificationRepository.save(notification);
    }

    public Notification createApplicationNotification(String recipientId, String senderId, String type, String jobId, String jobTitle) {
        User sender = userRepository.findById(senderId).orElse(null);
        
        String title = "";
        String message = "";
        String icon = "";
        
        if ("APPLIED".equals(type)) {
            title = "New Application";
            message = "A student has applied for " + jobTitle;
            icon = "FiCheckCircle";
        } else if ("SHORTLISTED".equals(type)) {
            title = "You're Shortlisted!";
            message = "You have been shortlisted for " + jobTitle;
            icon = "FiStar";
        } else if ("REJECTED".equals(type)) {
            title = "Application Update";
            message = "Your application for " + jobTitle + " was not selected";
            icon = "FiX";
        } else if ("SELECTED".equals(type)) {
            title = "Congratulations!";
            message = "You have been selected for " + jobTitle + "! Recruiter will contact you soon.";
            icon = "FiCheckCircle";
        }
        
        Notification notification = new Notification();
        notification.setUserId(recipientId);
        notification.setSenderId(senderId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setIcon(icon);
        notification.setJobId(jobId);
        notification.setJobTitle(jobTitle);
        
        if (sender != null) {
            notification.setSenderName(sender.getFullName());
            notification.setSenderEmail(sender.getEmail());
            notification.setSenderRole(sender.getRole());
        }
        
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    public Notification markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        for (Notification notification : unread) {
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
        }
        notificationRepository.saveAll(unread);
    }

    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public void deleteByApplicationId(String applicationId) {
        notificationRepository.deleteByApplicationId(applicationId);
    }
}
