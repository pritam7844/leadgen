package com.leadflow.source;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Document(collection = "sources")
public class Source {

    @Id
    private String id;

    @Indexed
    private String workspaceId;

    private String name;
    private SourceType type;
    private boolean isActive = true;
    private Config config = new Config();
    private Schedule schedule = new Schedule();
    private Instant lastRun;
    private String lastRunStatus;
    private Long leadsAdded = 0L;

    @CreatedDate
    private Instant createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(String workspaceId) { this.workspaceId = workspaceId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public SourceType getType() { return type; }
    public void setType(SourceType type) { this.type = type; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public Config getConfig() { return config; }
    public void setConfig(Config config) { this.config = config; }
    public Schedule getSchedule() { return schedule; }
    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public enum SourceType { CSV, SCRAPER_API, CUSTOM_SCRAPER, PLATFORM }

    public static class Config {
        private String apiEndpoint;
        private String authType;
        private String encryptedAuthValue;
        private String method = "GET";
        private Map<String, Object> requestBody;
        private String responsePath;
        private List<FieldMapping> fieldMappings;
        private String paginationType = "NONE";
        private Map<String, Object> paginationConfig;

        public String getApiEndpoint() { return apiEndpoint; }
        public void setApiEndpoint(String apiEndpoint) { this.apiEndpoint = apiEndpoint; }
        public String getAuthType() { return authType; }
        public void setAuthType(String authType) { this.authType = authType; }
        public String getMethod() { return method; }
        public void setMethod(String method) { this.method = method; }
        public String getEncryptedAuthValue() { return encryptedAuthValue; }
        public void setEncryptedAuthValue(String encryptedAuthValue) { this.encryptedAuthValue = encryptedAuthValue; }
        // Add more getters/setters as needed or just basic ones
    }

    public static class FieldMapping {
        private String sourceField;
        private String targetField;
    }

    public static class Schedule {
        private boolean enabled = false;
        private String cron;
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        public String getCron() { return cron; }
        public void setCron(String cron) { this.cron = cron; }
    }
}
