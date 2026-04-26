package com.leadflow.apikey;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ApiKeyRepository extends MongoRepository<ApiKey, String> {
    List<ApiKey> findByWorkspaceId(String workspaceId);
    Optional<ApiKey> findByWorkspaceIdAndService(String workspaceId, String service);
}
