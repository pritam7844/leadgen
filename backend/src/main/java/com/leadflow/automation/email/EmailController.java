package com.leadflow.automation.email;

import com.leadflow.common.response.ApiResponse;
import com.leadflow.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/automation/email")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/providers")
    public ResponseEntity<ApiResponse<List<EmailProvider>>> getProviders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(emailService.findByWorkspace(user.getWorkspaceId())));
    }

    @PostMapping("/providers")
    public ResponseEntity<ApiResponse<EmailProvider>> createProvider(
            @AuthenticationPrincipal User user,
            @RequestBody EmailProvider provider) {
        return ResponseEntity.ok(ApiResponse.ok(emailService.create(user.getWorkspaceId(), provider)));
    }

    @PutMapping("/providers/{id}")
    public ResponseEntity<ApiResponse<EmailProvider>> updateProvider(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @RequestBody EmailProvider provider) {
        return ResponseEntity.ok(ApiResponse.ok(emailService.update(user.getWorkspaceId(), id, provider)));
    }

    @DeleteMapping("/providers/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProvider(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        emailService.delete(user.getWorkspaceId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Provider deleted", null));
    }

    @PostMapping("/providers/{id}/test")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testProvider(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(emailService.testConnection(user.getWorkspaceId(), id)));
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<Void>> sendEmail(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        emailService.sendEmail(user.getWorkspaceId(), body.get("to"), body.get("subject"), body.get("body"));
        return ResponseEntity.ok(ApiResponse.ok("Email sent", null));
    }
}
