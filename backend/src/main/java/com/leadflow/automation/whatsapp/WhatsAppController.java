package com.leadflow.automation.whatsapp;

import com.leadflow.common.response.ApiResponse;
import com.leadflow.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/automation/whatsapp")
public class WhatsAppController {

    private final WhatsAppConfigRepository whatsAppConfigRepository;

    public WhatsAppController(WhatsAppConfigRepository whatsAppConfigRepository) {
        this.whatsAppConfigRepository = whatsAppConfigRepository;
    }

    @GetMapping("/configs")
    public ResponseEntity<ApiResponse<List<WhatsAppConfig>>> getConfigs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(
                whatsAppConfigRepository.findByWorkspaceId(user.getWorkspaceId())));
    }

    @PostMapping("/configs")
    public ResponseEntity<ApiResponse<WhatsAppConfig>> createConfig(
            @AuthenticationPrincipal User user,
            @RequestBody WhatsAppConfig config) {
        config.setWorkspaceId(user.getWorkspaceId());
        return ResponseEntity.ok(ApiResponse.ok(whatsAppConfigRepository.save(config)));
    }

    @PutMapping("/configs/{id}")
    public ResponseEntity<ApiResponse<WhatsAppConfig>> updateConfig(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @RequestBody WhatsAppConfig updated) {
        WhatsAppConfig config = whatsAppConfigRepository.findById(id).orElseThrow();
        config.setLabel(updated.getLabel());
        config.setFromNumber(updated.getFromNumber());
        config.setDefault(updated.isDefault());
        return ResponseEntity.ok(ApiResponse.ok(whatsAppConfigRepository.save(config)));
    }

    @GetMapping("/providers")
    public ResponseEntity<ApiResponse<List<String>>> getProviders() {
        return ResponseEntity.ok(ApiResponse.ok(
                Arrays.stream(WhatsAppConfig.WhatsAppProvider.values())
                        .map(Enum::name).collect(Collectors.toList())));
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<Void>> send(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.ok("Message queued", null));
    }
}
