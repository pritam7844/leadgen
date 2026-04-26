package com.leadflow.integration;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "integrations")
public class IntegrationConfig {

    @Id
    private String id;
    private String workspaceId;
    private String name;
    private String type;
    private String apiEndpoint;
    private String authType;
    private String encryptedAuthValue;
    private String method = "GET";
    private Map<String, Object> requestBody;
    private String responsePath;
    private List<FieldMapping> fieldMappings;
    private String paginationType = "NONE";
    private Map<String, Object> paginationConfig;
    private Instant createdAt = Instant.now();

    @Data
    public static class FieldMapping {
        private String sourceField;
        private String targetField;
    }
}
