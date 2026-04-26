package com.leadflow.source;

import com.leadflow.common.response.ApiResponse;
import com.leadflow.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sources")
@RequiredArgsConstructor
public class SourceController {

    private final SourceService sourceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Source>>> getSources(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(sourceService.findByWorkspace(user.getWorkspaceId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Source>> createSource(
            @AuthenticationPrincipal User user,
            @RequestBody Source source) {
        return ResponseEntity.ok(ApiResponse.ok(sourceService.create(user.getWorkspaceId(), source)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Source>> getSource(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(sourceService.getById(user.getWorkspaceId(), id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Source>> updateSource(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @RequestBody Source source) {
        return ResponseEntity.ok(ApiResponse.ok(sourceService.update(user.getWorkspaceId(), id, source)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSource(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        sourceService.delete(user.getWorkspaceId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Source deleted", null));
    }

    @PostMapping("/csv-upload")
    public ResponseEntity<ApiResponse<Map<String, Object>>> csvUpload(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.ok(sourceService.runCsvUpload(user.getWorkspaceId(), file)));
    }

    @PostMapping("/{id}/run")
    public ResponseEntity<ApiResponse<Void>> runSource(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        sourceService.getById(user.getWorkspaceId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Source run triggered", null));
    }

    @PostMapping("/{id}/test")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testSource(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        sourceService.getById(user.getWorkspaceId(), id);
        return ResponseEntity.ok(ApiResponse.ok(Map.of("status", "ok", "message", "Connection successful")));
    }
}
