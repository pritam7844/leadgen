package com.leadflow.source;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SourceRepository extends MongoRepository<Source, String> {
    List<Source> findByWorkspaceId(String workspaceId);
    List<Source> findByWorkspaceIdAndType(String workspaceId, Source.SourceType type);
    List<Source> findByScheduleEnabledTrue();
}
