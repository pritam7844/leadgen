package com.leadflow.dashboard;

import com.leadflow.automation.campaign.CampaignRepository;
import com.leadflow.lead.Lead;
import com.leadflow.lead.LeadRepository;
import com.leadflow.source.SourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final LeadRepository leadRepository;
    private final SourceRepository sourceRepository;
    private final CampaignRepository campaignRepository;

    public Map<String, Object> getStats(String workspaceId) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLeads", leadRepository.countByWorkspaceId(workspaceId));
        stats.put("contacted", leadRepository.countByWorkspaceIdAndStatus(workspaceId, Lead.Status.CONTACTED));
        stats.put("meetingsBooked", leadRepository.countByWorkspaceIdAndStatus(workspaceId, Lead.Status.MEETING_BOOKED));
        stats.put("converted", leadRepository.countByWorkspaceIdAndStatus(workspaceId, Lead.Status.CONVERTED));
        stats.put("activeSources", sourceRepository.findByWorkspaceId(workspaceId).stream()
                .filter(s -> s.isActive()).count());
        stats.put("activeCampaigns", campaignRepository.findByWorkspaceId(workspaceId).stream()
                .filter(c -> c.getStatus().name().equals("ACTIVE")).count());
        return stats;
    }

    public List<Lead> getRecentLeads(String workspaceId) {
        return leadRepository.findByWorkspaceId(workspaceId,
                PageRequest.of(0, 10, Sort.by("createdAt").descending())).getContent();
    }

    public Map<String, Long> getSourceBreakdown(String workspaceId) {
        List<Lead> leads = leadRepository.findByWorkspaceId(workspaceId,
                PageRequest.of(0, 10000, Sort.by("createdAt").descending())).getContent();
        return leads.stream()
                .filter(l -> l.getSource() != null)
                .collect(Collectors.groupingBy(Lead::getSource, Collectors.counting()));
    }

    public List<Object> getCampaignPerformance(String workspaceId) {
        return campaignRepository.findByWorkspaceId(workspaceId).stream()
                .map(c -> (Object) Map.of(
                        "name", c.getName(),
                        "status", c.getStatus(),
                        "stats", c.getStats(),
                        "leads", c.getLeadIds().size()))
                .collect(Collectors.toList());
    }
}
