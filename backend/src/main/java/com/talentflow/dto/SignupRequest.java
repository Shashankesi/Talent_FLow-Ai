package com.talentflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String role;
    private String companyName;
    private String companyWebsite;
}

@Data
class LoginRequest {
    private String email;
    private String password;
}

@Data
class AuthResponse {
    private String token;
    private String role;
    private UserDTO user;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class UserDTO {
    private String id;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private Double profileCompletion;
}
