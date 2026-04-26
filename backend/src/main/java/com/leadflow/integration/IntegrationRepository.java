package com.leadflow.integration;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface IntegrationRepository extends MongoRepository<IntegrationConfig, String> {
    List<IntegrationConfig> findByWorkspaceId(String workspaceId);
}
