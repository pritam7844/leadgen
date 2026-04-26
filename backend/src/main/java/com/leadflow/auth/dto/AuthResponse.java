package com.leadflow.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private long expiresIn;
    private UserInfo user;

    @Data
    @Builder
    public static class UserInfo {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String plan;
        private Long credits;
        private String workspaceId;
    }
}
