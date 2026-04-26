package com.leadflow.lead;

import com.leadflow.common.exception.LeadFlowException;
import com.leadflow.common.util.PaginationUtil;
import com.leadflow.lead.dto.LeadFilterRequest;
import com.leadflow.lead.dto.LeadRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;
    private final MongoTemplate mongoTemplate;

    public Page<Lead> findLeads(String workspaceId, LeadFilterRequest filter) {
        Pageable pageable = PaginationUtil.of(filter.getPage(), filter.getSize(),
                filter.getSortBy(), filter.getSortDir());
        Criteria criteria = Criteria.where("workspaceId").is(workspaceId);

        if (filter.getStatus() != null) criteria.and("status").is(filter.getStatus());
        if (filter.getIndustry() != null) criteria.and("industry").is(filter.getIndustry());
        if (filter.getCity() != null) criteria.and("city").is(filter.getCity());
        if (filter.getSource() != null) criteria.and("source").is(filter.getSource());
        if (filter.getMinScore() != null) criteria.and("score").gte(filter.getMinScore());
        if (filter.getMaxScore() != null) criteria.and("score").lte(filter.getMaxScore());
        if (filter.getSearch() != null && !filter.getSearch().isBlank()) {
            String regex = ".*" + filter.getSearch() + ".*";
            criteria.orOperator(
                    Criteria.where("firstName").regex(regex, "i"),
                    Criteria.where("lastName").regex(regex, "i"),
                    Criteria.where("email").regex(regex, "i"),
                    Criteria.where("company").regex(regex, "i")
            );
        }

        Query query = new Query(criteria).with(pageable);
        List<Lead> leads = mongoTemplate.find(query, Lead.class);
        return PageableExecutionUtils.getPage(leads, pageable,
                () -> mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Lead.class));
    }

    public Lead create(String workspaceId, LeadRequest request) {
        Lead lead = new Lead();
        lead.setWorkspaceId(workspaceId);
        mapRequest(lead, request);
        return leadRepository.save(lead);
    }

    public Lead getById(String workspaceId, String id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new LeadFlowException("Lead not found", HttpStatus.NOT_FOUND));
        if (!lead.getWorkspaceId().equals(workspaceId))
            throw new LeadFlowException("Access denied", HttpStatus.FORBIDDEN);
        return lead;
    }

    public Lead update(String workspaceId, String id, LeadRequest request) {
        Lead lead = getById(workspaceId, id);
        mapRequest(lead, request);
        return leadRepository.save(lead);
    }

    public void delete(String workspaceId, String id) {
        Lead lead = getById(workspaceId, id);
        leadRepository.delete(lead);
    }

    public void bulkDelete(String workspaceId, List<String> ids) {
        leadRepository.deleteByWorkspaceIdAndIdIn(workspaceId, ids);
    }

    public Map<String, Long> getStats(String workspaceId) {
        return Map.of(
                "total", leadRepository.countByWorkspaceId(workspaceId),
                "new", leadRepository.countByWorkspaceIdAndStatus(workspaceId, Lead.Status.NEW),
                "contacted", leadRepository.countByWorkspaceIdAndStatus(workspaceId, Lead.Status.CONTACTED),
                "qualified", leadRepository.countByWorkspaceIdAndStatus(workspaceId, Lead.Status.QUALIFIED),
                "meetingBooked", leadRepository.countByWorkspaceIdAndStatus(workspaceId, Lead.Status.MEETING_BOOKED),
                "converted", leadRepository.countByWorkspaceIdAndStatus(workspaceId, Lead.Status.CONVERTED)
        );
    }

    public Lead saveOrUpdate(Lead lead) {
        if (lead.getEmail() != null && lead.getWorkspaceId() != null) {
            leadRepository.findByWorkspaceIdAndEmail(lead.getWorkspaceId(), lead.getEmail())
                    .ifPresent(existing -> lead.setId(existing.getId()));
        }
        return leadRepository.save(lead);
    }

    private void mapRequest(Lead lead, LeadRequest req) {
        if (req.getFirstName() != null) lead.setFirstName(req.getFirstName());
        if (req.getLastName() != null) lead.setLastName(req.getLastName());
        if (req.getEmail() != null) lead.setEmail(req.getEmail());
        if (req.getPhone() != null) lead.setPhone(req.getPhone());
        if (req.getCompany() != null) lead.setCompany(req.getCompany());
        if (req.getIndustry() != null) lead.setIndustry(req.getIndustry());
        if (req.getCompanySize() != null) lead.setCompanySize(req.getCompanySize());
        if (req.getLocation() != null) lead.setLocation(req.getLocation());
        if (req.getCity() != null) lead.setCity(req.getCity());
        if (req.getRegion() != null) lead.setRegion(req.getRegion());
        if (req.getSource() != null) lead.setSource(req.getSource());
        if (req.getTags() != null) lead.setTags(req.getTags());
        if (req.getCustomFields() != null) lead.setCustomFields(req.getCustomFields());
    }
}
