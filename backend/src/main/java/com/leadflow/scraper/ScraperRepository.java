package com.leadflow.scraper;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ScraperRepository extends MongoRepository<ScraperConfig, String> {
    List<ScraperConfig> findByWorkspaceId(String workspaceId);
}
