package com.leadflow.arearun;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AreaRunRepository extends MongoRepository<AreaRun, String> {
    List<AreaRun> findByWorkspaceIdOrderByStartedAtDesc(String workspaceId);
}
