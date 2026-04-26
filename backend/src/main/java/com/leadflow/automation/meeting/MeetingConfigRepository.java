package com.leadflow.automation.meeting;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MeetingConfigRepository extends MongoRepository<MeetingConfig, String> {
    List<MeetingConfig> findByWorkspaceId(String workspaceId);
}
