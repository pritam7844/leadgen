package com.leadflow.automation.email;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface EmailProviderRepository extends MongoRepository<EmailProvider, String> {
    List<EmailProvider> findByWorkspaceId(String workspaceId);
    Optional<EmailProvider> findByWorkspaceIdAndIsDefaultTrue(String workspaceId);
}
