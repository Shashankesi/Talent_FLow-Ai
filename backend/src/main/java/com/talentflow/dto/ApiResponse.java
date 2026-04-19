package com.talentflow.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Standard API Response Wrapper
 * Provides consistent response format for all API endpoints
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    private String error;
    private int statusCode;
    private LocalDateTime timestamp;

    /**
     * Success response builder
     */
    public static <T> ApiResponse<T> success(String message, T data, int statusCode) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .statusCode(statusCode)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Success response with default status 200
     */
    public static <T> ApiResponse<T> success(String message, T data) {
        return success(message, data, 200);
    }

    /**
     * Success response with only message
     */
    public static <T> ApiResponse<T> success(String message) {
        return success(message, null, 200);
    }

    /**
     * Error response builder
     */
    public static <T> ApiResponse<T> error(String message, String error, int statusCode) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .error(error)
                .statusCode(statusCode)
                .timestamp(LocalDateTime.now())
                .build();
    }

    /**
     * Error response with default status 400
     */
    public static <T> ApiResponse<T> error(String message, String error) {
        return error(message, error, 400);
    }

    /**
     * Error response with only error message
     */
    public static <T> ApiResponse<T> error(String error) {
        return error("Operation failed", error, 400);
    }
}
