package com.leadflow.lead;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LeadRepository extends MongoRepository<Lead, String> {
    Page<Lead> findByWorkspaceId(String workspaceId, Pageable pageable);
    Optional<Lead> findByWorkspaceIdAndEmail(String workspaceId, String email);
    boolean existsByWorkspaceIdAndEmail(String workspaceId, String email);
    long countByWorkspaceId(String workspaceId);
    long countByWorkspaceIdAndStatus(String workspaceId, Lead.Status status);
    List<Lead> findByWorkspaceIdAndIdIn(String workspaceId, List<String> ids);

    @Query("{ 'workspaceId': ?0, 'status': ?1 }")
    Page<Lead> findByWorkspaceIdAndStatus(String workspaceId, Lead.Status status, Pageable pageable);

    @Query("{ 'workspaceId': ?0, 'industry': ?1 }")
    Page<Lead> findByWorkspaceIdAndIndustry(String workspaceId, String industry, Pageable pageable);

    void deleteByWorkspaceIdAndIdIn(String workspaceId, List<String> ids);
}
