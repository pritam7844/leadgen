package com.leadflow.integration;

import com.leadflow.common.response.ApiResponse;
import com.leadflow.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/integrations")
@RequiredArgsConstructor
public class IntegrationController {

    private final IntegrationRepository integrationRepository;
    private final GenericApiRunner genericApiRunner;

    @GetMapping
    public ResponseEntity<ApiResponse<List<IntegrationConfig>>> getIntegrations(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(
                integrationRepository.findByWorkspaceId(user.getWorkspaceId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<IntegrationConfig>> createIntegration(
            @AuthenticationPrincipal User user,
            @RequestBody IntegrationConfig config) {
        config.setWorkspaceId(user.getWorkspaceId());
        return ResponseEntity.ok(ApiResponse.ok(integrationRepository.save(config)));
    }

    @PostMapping("/{id}/test")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testIntegration(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        IntegrationConfig config = integrationRepository.findById(id).orElseThrow();
        try {
            int count = genericApiRunner.run(user.getWorkspaceId(), config);
            return ResponseEntity.ok(ApiResponse.ok(Map.of("success", true, "leadsFound", count)));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.ok(Map.of("success", false, "error", e.getMessage())));
        }
    }

    @PostMapping("/{id}/run")
    public ResponseEntity<ApiResponse<Map<String, Object>>> runIntegration(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        IntegrationConfig config = integrationRepository.findById(id).orElseThrow();
        int added = genericApiRunner.run(user.getWorkspaceId(), config);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("leadsAdded", added)));
    }

    @PostMapping("/apollo/search")
    public ResponseEntity<ApiResponse<Map<String, Object>>> apolloSearch(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> filters) {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("leads", List.of(), "total", 0)));
    }

    @PostMapping("/ghl/sync")
    public ResponseEntity<ApiResponse<Map<String, Object>>> ghlSync(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("synced", 0)));
    }

    @PostMapping("/apify/run")
    public ResponseEntity<ApiResponse<Map<String, Object>>> apifyRun(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("runId", "run_" + System.currentTimeMillis())));
    }
}
