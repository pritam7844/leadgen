package com.leadflow.workspace;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface WorkspaceRepository extends MongoRepository<Workspace, String> {
    List<Workspace> findByOwnerId(String ownerId);
    List<Workspace> findByMembersUserId(String userId);
}
