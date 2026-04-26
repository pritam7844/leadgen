package com.leadflow.automation.campaign;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CampaignRepository extends MongoRepository<Campaign, String> {
    List<Campaign> findByWorkspaceId(String workspaceId);
}
