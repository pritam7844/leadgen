package com.leadflow.apikey;

import com.leadflow.common.response.ApiResponse;
import com.leadflow.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/api-keys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ApiKey>>> getKeys(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(apiKeyService.findByWorkspace(user.getWorkspaceId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApiKey>> createKey(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.ok(apiKeyService.create(user.getWorkspaceId(), body)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteKey(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        apiKeyService.delete(user.getWorkspaceId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Key deleted", null));
    }

    @GetMapping("/services")
    public ResponseEntity<ApiResponse<List<String>>> getSupportedServices() {
        return ResponseEntity.ok(ApiResponse.ok(apiKeyService.getSupportedServices()));
    }
}
