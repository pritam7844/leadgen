package com.leadflow.automation.calling;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CallConfigRepository extends MongoRepository<CallConfig, String> {
    List<CallConfig> findByWorkspaceId(String workspaceId);
}
