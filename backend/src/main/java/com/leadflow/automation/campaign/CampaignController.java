package com.leadflow.automation.campaign;

import com.leadflow.common.response.ApiResponse;
import com.leadflow.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {

    private final CampaignRepository campaignRepository;

    public CampaignController(CampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Campaign>>> getCampaigns(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(campaignRepository.findByWorkspaceId(user.getWorkspaceId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Campaign>> createCampaign(
            @AuthenticationPrincipal User user,
            @RequestBody Campaign campaign) {
        campaign.setWorkspaceId(user.getWorkspaceId());
        return ResponseEntity.ok(ApiResponse.ok(campaignRepository.save(campaign)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Campaign>> getCampaign(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(campaignRepository.findById(id).orElseThrow()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Campaign>> updateCampaign(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @RequestBody Campaign updated) {
        Campaign campaign = campaignRepository.findById(id).orElseThrow();
        campaign.setName(updated.getName());
        campaign.setSteps(updated.getSteps());
        campaign.setLeadIds(updated.getLeadIds());
        return ResponseEntity.ok(ApiResponse.ok(campaignRepository.save(campaign)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCampaign(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        campaignRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Campaign deleted", null));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<ApiResponse<Campaign>> startCampaign(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        Campaign campaign = campaignRepository.findById(id).orElseThrow();
        campaign.setStatus(Campaign.Status.ACTIVE);
        return ResponseEntity.ok(ApiResponse.ok(campaignRepository.save(campaign)));
    }

    @PostMapping("/{id}/pause")
    public ResponseEntity<ApiResponse<Campaign>> pauseCampaign(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        Campaign campaign = campaignRepository.findById(id).orElseThrow();
        campaign.setStatus(Campaign.Status.PAUSED);
        return ResponseEntity.ok(ApiResponse.ok(campaignRepository.save(campaign)));
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<ApiResponse<Campaign.Stats>> getCampaignStats(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        Campaign campaign = campaignRepository.findById(id).orElseThrow();
        return ResponseEntity.ok(ApiResponse.ok(campaign.getStats()));
    }
}
