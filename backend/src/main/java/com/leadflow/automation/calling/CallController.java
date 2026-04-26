package com.leadflow.automation.calling;

import com.leadflow.common.response.ApiResponse;
import com.leadflow.user.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/automation/calling")
public class CallController {

    private final CallConfigRepository callConfigRepository;

    public CallController(CallConfigRepository callConfigRepository) {
        this.callConfigRepository = callConfigRepository;
    }

    @GetMapping("/configs")
    public ResponseEntity<ApiResponse<List<CallConfig>>> getConfigs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(
                callConfigRepository.findByWorkspaceId(user.getWorkspaceId())));
    }

    @PostMapping("/configs")
    public ResponseEntity<ApiResponse<CallConfig>> createConfig(
            @AuthenticationPrincipal User user,
            @RequestBody CallConfig config) {
        config.setWorkspaceId(user.getWorkspaceId());
        return ResponseEntity.ok(ApiResponse.ok(callConfigRepository.save(config)));
    }

    @PutMapping("/configs/{id}")
    public ResponseEntity<ApiResponse<CallConfig>> updateConfig(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @RequestBody CallConfig updated) {
        CallConfig config = callConfigRepository.findById(id).orElseThrow();
        config.setLabel(updated.getLabel());
        config.setFromNumber(updated.getFromNumber());
        config.setDefault(updated.isDefault());
        return ResponseEntity.ok(ApiResponse.ok(callConfigRepository.save(config)));
    }

    @DeleteMapping("/configs/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteConfig(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        callConfigRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Config deleted", null));
    }

    @GetMapping("/providers")
    public ResponseEntity<ApiResponse<List<String>>> getProviders() {
        List<String> providers = Arrays.stream(CallConfig.CallProvider.values())
                .map(Enum::name)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.ok(providers));
    }

    @PostMapping("/call")
    public ResponseEntity<ApiResponse<Void>> initiateCall(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok("Call initiated", null));
    }
}
