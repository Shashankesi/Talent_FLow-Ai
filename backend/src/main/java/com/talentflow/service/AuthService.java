package com.talentflow.service;

import com.talentflow.dto.SignupRequest;
import com.talentflow.entity.User;
import com.talentflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setIsActive(true);
        user.setProfileCompletion(0.0);

        if ("RECRUITER".equals(request.getRole())) {
            user.setCompanyName(request.getCompanyName());
            user.setCompanyWebsite(request.getCompanyWebsite());
        }

        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateProfile(String userId, User userDetails) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (userDetails.getFullName() != null) user.setFullName(userDetails.getFullName());
        if (userDetails.getPhone() != null) user.setPhone(userDetails.getPhone());
        if (userDetails.getSkills() != null) user.setSkills(userDetails.getSkills());
        if (userDetails.getEducation() != null) user.setEducation(userDetails.getEducation());
        if (userDetails.getExperience() != null) user.setExperience(userDetails.getExperience());
        
        user.setUpdatedAt(LocalDateTime.now());
        
        // Calculate profile completion
        calculateProfileCompletion(user);
        
        return userRepository.save(user);
    }

    public void calculateProfileCompletion(User user) {
        int fields = 0;
        int completed = 0;

        fields++; if (user.getFullName() != null && !user.getFullName().isEmpty()) completed++;
        fields++; if (user.getEmail() != null && !user.getEmail().isEmpty()) completed++;
        fields++; if (user.getPhone() != null && !user.getPhone().isEmpty()) completed++;
        fields++; if (user.getSkills() != null && !user.getSkills().isEmpty()) completed++;
        fields++; if (user.getEducation() != null && !user.getEducation().isEmpty()) completed++;
        fields++; if (user.getExperience() != null && !user.getExperience().isEmpty()) completed++;
        fields++; if (user.getResumeId() != null && !user.getResumeId().isEmpty()) completed++;
        fields++; if (user.getProfilePhoto() != null && !user.getProfilePhoto().isEmpty()) completed++;

        user.setProfileCompletion((double) (completed * 100) / fields);
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void updateResumeReference(String userId, String resumeId) {
        User user = getUserById(userId);
        user.setResumeId(resumeId);
        user.setUpdatedAt(LocalDateTime.now());
        calculateProfileCompletion(user);
        userRepository.save(user);
    }
}
