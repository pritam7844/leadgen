package com.leadflow.apikey;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
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
}
