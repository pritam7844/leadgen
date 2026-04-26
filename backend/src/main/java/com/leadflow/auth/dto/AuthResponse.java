package com.leadflow.auth.dto;


public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private long expiresIn;
    private UserInfo user;

    public AuthResponse() {}
    public AuthResponse(String accessToken, String refreshToken, String tokenType, long expiresIn, UserInfo user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
        this.user = user;
    }

    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public UserInfo getUser() { return user; }

    public static AuthResponseBuilder builder() { return new AuthResponseBuilder(); }

    public static class AuthResponseBuilder {
        private String accessToken;
        private String refreshToken;
        private String tokenType = "Bearer";
        private long expiresIn;
        private UserInfo user;

        public AuthResponseBuilder accessToken(String accessToken) { this.accessToken = accessToken; return this; }
        public AuthResponseBuilder refreshToken(String refreshToken) { this.refreshToken = refreshToken; return this; }
        public AuthResponseBuilder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public AuthResponseBuilder expiresIn(long expiresIn) { this.expiresIn = expiresIn; return this; }
        public AuthResponseBuilder user(UserInfo user) { this.user = user; return this; }
        public AuthResponse build() { return new AuthResponse(accessToken, refreshToken, tokenType, expiresIn, user); }
    }

    public static class UserInfo {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String plan;
        private Long credits;
        private String workspaceId;

        public UserInfo() {}
        public UserInfo(String id, String firstName, String lastName, String email, String plan, Long credits, String workspaceId) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.plan = plan;
            this.credits = credits;
            this.workspaceId = workspaceId;
        }

        public static UserInfoBuilder builder() { return new UserInfoBuilder(); }

        public static class UserInfoBuilder {
            private String id;
            private String firstName;
            private String lastName;
            private String email;
            private String plan;
            private Long credits;
            private String workspaceId;

            public UserInfoBuilder id(String id) { this.id = id; return this; }
            public UserInfoBuilder firstName(String firstName) { this.firstName = firstName; return this; }
            public UserInfoBuilder lastName(String lastName) { this.lastName = lastName; return this; }
            public UserInfoBuilder email(String email) { this.email = email; return this; }
            public UserInfoBuilder plan(String plan) { this.plan = plan; return this; }
            public UserInfoBuilder credits(Long credits) { this.credits = credits; return this; }
            public UserInfoBuilder workspaceId(String workspaceId) { this.workspaceId = workspaceId; return this; }
            public UserInfo build() { return new UserInfo(id, firstName, lastName, email, plan, credits, workspaceId); }
        }

        public String getId() { return id; }
        public String getWorkspaceId() { return workspaceId; }
    }
}
