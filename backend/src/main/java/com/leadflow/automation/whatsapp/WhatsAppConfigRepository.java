package com.leadflow.automation.whatsapp;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface WhatsAppConfigRepository extends MongoRepository<WhatsAppConfig, String> {
    List<WhatsAppConfig> findByWorkspaceId(String workspaceId);
}
