package com.talentflow.controller;

import com.talentflow.dto.*;
import com.talentflow.entity.User;
import com.talentflow.security.JwtTokenProvider;
import com.talentflow.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * Authentication Controller
 * Handles signup, login, profile, and token refresh endpoints
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    /**
     * Register/Signup API
     * POST /api/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Map<String, Object>>> signup(@RequestBody @Valid SignupRequest request) {
        log.info("Signup request for email: {}", request.getEmail());
        
        try {
            // Check if email already exists
            if (authService.findByEmail(request.getEmail()).isPresent()) {
                log.warn("Signup failed: Email already exists - {}", request.getEmail());
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Email already registered", "Please login instead", 400));
            }

            // Create new user
            User user = authService.signup(request);
            log.info("User registered successfully: {} (Role: {})", user.getEmail(), user.getRole());

            // Generate tokens
            String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), user.getRole());
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

            // Build response
            TokenResponse tokenResponse = TokenResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .tokenType("Bearer")
                    .accessTokenExpiresIn(jwtTokenProvider.getAccessTokenExpiration())
                    .refreshTokenExpiresIn(jwtTokenProvider.getRefreshTokenExpiration())
                    .role(user.getRole())
                    .build();

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("token", accessToken);
            responseData.put("refreshToken", refreshToken);
            responseData.put("role", user.getRole());
            responseData.put("user", mapUserToDTO(user));

            return ResponseEntity.ok(
                    ApiResponse.success("User registered successfully", responseData, 201)
            );
        } catch (Exception e) {
            log.error("Signup error: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Signup failed", e.getMessage(), 400));
        }
    }

    /**
     * Login API
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        log.info("Login attempt for email: {}", email);

        try {
            // Validate input
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Validation failed", "Email is required", 400));
            }
            
            if (password == null || password.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Validation failed", "Password is required", 400));
            }

            // Find user
            User user = authService.findByEmail(email)
                    .orElseThrow(() -> {
                        log.warn("Login failed: User not found - {}", email);
                        return new RuntimeException("User not found");
                    });

            // Verify password
            if (!passwordEncoder.matches(password, user.getPassword())) {
                log.warn("Login failed: Invalid password for - {}", email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Authentication failed", "Invalid email or password", 401));
            }

            // Check if user is active
            if (!user.getIsActive()) {
                log.warn("Login failed: Account is inactive - {}", email);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Account inactive", "Your account has been deactivated", 401));
            }

            // Generate tokens
            String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), user.getRole());
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

            log.info("User logged in successfully: {} (Role: {})", user.getEmail(), user.getRole());

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("token", accessToken);
            responseData.put("refreshToken", refreshToken);
            responseData.put("role", user.getRole());
            responseData.put("user", mapUserToDTO(user));

            return ResponseEntity.ok(
                    ApiResponse.success("Login successful", responseData, 200)
            );
        } catch (RuntimeException e) {
            log.error("Login error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Login failed", "Invalid email or password", 401));
        } catch (Exception e) {
            log.error("Unexpected login error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Login failed", "An error occurred during login", 500));
        }
    }

    /**
     * Refresh Access Token
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Map<String, Object>>> refreshToken(@RequestBody @Valid TokenRefreshRequest request) {
        log.info("Token refresh request received");

        try {
            String refreshToken = request.getRefreshToken();

            // Validate refresh token
            if (!jwtTokenProvider.validateToken(refreshToken)) {
                log.warn("Token refresh failed: Invalid refresh token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Token invalid", "Refresh token is invalid or expired", 401));
            }

            // Check if it's actually a refresh token
            if (!jwtTokenProvider.isRefreshToken(refreshToken)) {
                log.warn("Token refresh failed: Token is not a refresh token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid token type", "This is not a refresh token", 401));
            }

            // Extract email from refresh token
            String email = jwtTokenProvider.getEmailFromToken(refreshToken);
            
            // Get user
            User user = authService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Generate new access token
            String newAccessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), user.getRole());

            log.info("Token refreshed successfully for: {}", email);

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("accessToken", newAccessToken);
            responseData.put("refreshToken", refreshToken);
            responseData.put("tokenType", "Bearer");
            responseData.put("expiresIn", jwtTokenProvider.getAccessTokenExpiration());

            return ResponseEntity.ok(
                    ApiResponse.success("Token refreshed successfully", responseData, 200)
            );
        } catch (Exception e) {
            log.error("Token refresh error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Token refresh failed", e.getMessage(), 401));
        }
    }

    /**
     * Get User Profile
     * GET /api/auth/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid header", "Authorization header must start with Bearer", 400));
            }

            String token = authHeader.replace("Bearer ", "");
            
            // Validate token
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid token", "Token is invalid or expired", 401));
            }

            String email = jwtTokenProvider.getEmailFromToken(token);
            User user = authService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(
                    ApiResponse.success("Profile retrieved", mapUserToDTO(user), 200)
            );
        } catch (Exception e) {
            log.error("Profile fetch error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized", e.getMessage(), 401));
        }
    }

    /**
     * Update User Profile
     * PUT /api/auth/profile
     */
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody User userDetails) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Invalid header", "Authorization header required", 400));
            }

            String token = authHeader.replace("Bearer ", "");
            
            if (!jwtTokenProvider.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Invalid token", "Token is invalid or expired", 401));
            }

            String email = jwtTokenProvider.getEmailFromToken(token);
            User user = authService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            User updated = authService.updateProfile(user.getId(), userDetails);
            
            log.info("Profile updated for: {}", email);

            return ResponseEntity.ok(
                    ApiResponse.success("Profile updated successfully", mapUserToDTO(updated), 200)
            );
        } catch (Exception e) {
            log.error("Profile update error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Update failed", e.getMessage(), 400));
        }
    }

    /**
     * Map User Entity to DTO
     */
    private Map<String, Object> mapUserToDTO(User user) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", user.getId());
        dto.put("fullName", user.getFullName());
        dto.put("email", user.getEmail());
        dto.put("phone", user.getPhone());
        dto.put("role", user.getRole());
        dto.put("profileCompletion", user.getProfileCompletion());
        dto.put("skills", user.getSkills());
        dto.put("education", user.getEducation());
        dto.put("experience", user.getExperience());
        return dto;
    }
}
