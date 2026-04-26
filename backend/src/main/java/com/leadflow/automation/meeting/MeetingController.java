package com.leadflow.automation.meeting;

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
@RequestMapping("/api/automation/meetings")
public class MeetingController {

    private final MeetingConfigRepository meetingConfigRepository;

    public MeetingController(MeetingConfigRepository meetingConfigRepository) {
        this.meetingConfigRepository = meetingConfigRepository;
    }

    @GetMapping("/configs")
    public ResponseEntity<ApiResponse<List<MeetingConfig>>> getConfigs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(
                meetingConfigRepository.findByWorkspaceId(user.getWorkspaceId())));
    }

    @PostMapping("/configs")
    public ResponseEntity<ApiResponse<MeetingConfig>> createConfig(
            @AuthenticationPrincipal User user,
            @RequestBody MeetingConfig config) {
        config.setWorkspaceId(user.getWorkspaceId());
        return ResponseEntity.ok(ApiResponse.ok(meetingConfigRepository.save(config)));
    }

    @GetMapping("/providers")
    public ResponseEntity<ApiResponse<List<String>>> getProviders() {
        return ResponseEntity.ok(ApiResponse.ok(
                Arrays.stream(MeetingConfig.MeetingProvider.values())
                        .map(Enum::name).collect(Collectors.toList())));
    }

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<Map<String, String>>> book(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.ok(Map.of("bookingLink", "https://cal.com/schedule")));
    }
}
