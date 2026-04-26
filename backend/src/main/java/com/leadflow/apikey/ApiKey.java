package com.leadflow.apikey;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "apiKeys")
public class ApiKey {

    @Id
    private String id;

    @Indexed
    private String workspaceId;

    private String service;
    private String label;
    private String encryptedKey;
    private Instant addedAt = Instant.now();
    private Instant lastUsedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(String workspaceId) { this.workspaceId = workspaceId; }
    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getEncryptedKey() { return encryptedKey; }
    public void setEncryptedKey(String encryptedKey) { this.encryptedKey = encryptedKey; }
    public Instant getLastUsedAt() { return lastUsedAt; }
    public void setLastUsedAt(Instant lastUsedAt) { this.lastUsedAt = lastUsedAt; }
}
