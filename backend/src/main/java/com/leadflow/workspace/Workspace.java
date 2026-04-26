package com.leadflow.workspace;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "workspaces")
public class Workspace {

    @Id
    private String id;

    private String name;
    private String ownerId;
    private List<Member> members = new ArrayList<>();
    private Settings settings = new Settings();

    @CreatedDate
    private Instant createdAt;

    @Data
    public static class Member {
        private String userId;
        private Role role;

        public enum Role { OWNER, ADMIN, MEMBER }
    }

    @Data
    public static class Settings {
        private String timezone = "Asia/Kolkata";
        private String currency = "INR";
        private String defaultSource;
    }
}
