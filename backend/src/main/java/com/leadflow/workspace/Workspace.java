package com.leadflow.workspace;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    public List<Member> getMembers() { return members; }
    public void setMembers(List<Member> members) { this.members = members; }

    public static class Member {
        private String userId;
        private Role role;

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public Role getRole() { return role; }
        public void setRole(Role role) { this.role = role; }

        public enum Role { OWNER, ADMIN, MEMBER }
    }

    public static class Settings {
        private String timezone = "Asia/Kolkata";
        private String currency = "INR";
        private String defaultSource;

        public String getTimezone() { return timezone; }
        public void setTimezone(String timezone) { this.timezone = timezone; }
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
    }
}
