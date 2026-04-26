package com.leadflow.dashboard;

import com.leadflow.common.response.ApiResponse;
import com.leadflow.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getStats(user.getWorkspaceId())));
    }

    @GetMapping("/recent-leads")
    public ResponseEntity<ApiResponse<Object>> getRecentLeads(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getRecentLeads(user.getWorkspaceId())));
    }

    @GetMapping("/source-breakdown")
    public ResponseEntity<ApiResponse<Object>> getSourceBreakdown(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getSourceBreakdown(user.getWorkspaceId())));
    }

    @GetMapping("/campaign-performance")
    public ResponseEntity<ApiResponse<Object>> getCampaignPerformance(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getCampaignPerformance(user.getWorkspaceId())));
    }
}
