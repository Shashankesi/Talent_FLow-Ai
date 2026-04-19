package com.talentflow.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT Token Provider - Production Grade
 * Handles JWT token generation, validation, and refresh
 * Uses HS256 algorithm (256-bit key recommended)
 */
@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access-token.expiration:3600000}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token.expiration:604800000}")
    private long refreshTokenExpiration;

    @Value("${jwt.issuer:TalentFlow-AI}")
    private String issuer;

    @Value("${jwt.audience:TalentFlow-Client}")
    private String audience;

    /**
     * Generate Access Token
     * Valid for shorter duration (1 hour by default)
     */
    public String generateAccessToken(String email, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + accessTokenExpiration);

        try {
            return Jwts.builder()
                    .setSubject(email)
                    .claim("role", role)
                    .claim("tokenType", "access")
                    .setIssuer(issuer)
                    .setAudience(audience)
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            log.error("Error generating access token: {}", e.getMessage());
            throw new RuntimeException("Failed to generate access token", e);
        }
    }

    /**
     * Generate Refresh Token
     * Valid for longer duration (7 days by default)
     */
    public String generateRefreshToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenExpiration);

        try {
            return Jwts.builder()
                    .setSubject(email)
                    .claim("tokenType", "refresh")
                    .setIssuer(issuer)
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            log.error("Error generating refresh token: {}", e.getMessage());
            throw new RuntimeException("Failed to generate refresh token", e);
        }
    }

    /**
     * Backward compatible method for old token generation
     */
    public String generateTokenFromEmail(String email) {
        // Return access token for backward compatibility
        return generateAccessToken(email, "USER");
    }

    /**
     * Validate JWT Token
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    /**
     * Extract Email from Token
     */
    public String getEmailFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Error extracting email from token: {}", e.getMessage());
            throw new RuntimeException("Invalid token", e);
        }
    }

    /**
     * Extract Role from Token
     */
    public String getRoleFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return (String) claims.get("role");
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Error extracting role from token: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Get Token Type (access or refresh)
     */
    public String getTokenType(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return (String) claims.get("tokenType");
        } catch (JwtException e) {
            log.error("Error extracting token type: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Check if Token is Access Token
     */
    public boolean isAccessToken(String token) {
        return "access".equals(getTokenType(token));
    }

    /**
     * Check if Token is Refresh Token
     */
    public boolean isRefreshToken(String token) {
        return "refresh".equals(getTokenType(token));
    }

    /**
     * Get Token Expiration Time
     */
    public long getExpirationTime(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration().getTime();
        } catch (JwtException e) {
            log.error("Error extracting expiration from token: {}", e.getMessage());
            return 0;
        }
    }

    /**
     * Get Signing Key - Uses HS256 (256-bit key)
     * HS256 requires minimum 256 bits (32 bytes)
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        
        // Ensure minimum 32 bytes for HS256 (256 bits)
        if (keyBytes.length < 32) {
            log.warn("JWT secret is shorter than recommended 32 bytes for HS256");
        }
        
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Get Access Token Expiration Duration in Milliseconds
     */
    public long getAccessTokenExpiration() {
        return accessTokenExpiration;
    }

    /**
     * Get Refresh Token Expiration Duration in Milliseconds
     */
    public long getRefreshTokenExpiration() {
        return refreshTokenExpiration;
    }
}
