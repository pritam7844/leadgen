package com.leadflow.source;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
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

    public enum SourceType { CSV, SCRAPER_API, CUSTOM_SCRAPER, PLATFORM }

    @Data
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
    }

    @Data
    public static class FieldMapping {
        private String sourceField;
        private String targetField;
    }

    @Data
    public static class Schedule {
        private boolean enabled = false;
        private String cron;
    }
}
