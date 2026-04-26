package com.leadflow.lead;

import com.leadflow.common.response.ApiResponse;
import com.leadflow.lead.dto.LeadFilterRequest;
import com.leadflow.lead.dto.LeadRequest;
import com.leadflow.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Lead>>> getLeads(
            @AuthenticationPrincipal User user,
            LeadFilterRequest filter) {
        return ResponseEntity.ok(ApiResponse.ok(leadService.findLeads(user.getWorkspaceId(), filter)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Lead>> createLead(
            @AuthenticationPrincipal User user,
            @RequestBody LeadRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(leadService.create(user.getWorkspaceId(), request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Lead>> getLead(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(leadService.getById(user.getWorkspaceId(), id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Lead>> updateLead(
            @AuthenticationPrincipal User user,
            @PathVariable String id,
            @RequestBody LeadRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(leadService.update(user.getWorkspaceId(), id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLead(
            @AuthenticationPrincipal User user,
            @PathVariable String id) {
        leadService.delete(user.getWorkspaceId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Lead deleted", null));
    }

    @PostMapping("/bulk-delete")
    public ResponseEntity<ApiResponse<Void>> bulkDelete(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, List<String>> body) {
        leadService.bulkDelete(user.getWorkspaceId(), body.get("ids"));
        return ResponseEntity.ok(ApiResponse.ok("Leads deleted", null));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getStats(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.ok(leadService.getStats(user.getWorkspaceId())));
    }

    @PostMapping("/export")
    public ResponseEntity<byte[]> export(@AuthenticationPrincipal User user) {
        LeadFilterRequest filter = new LeadFilterRequest();
        filter.setSize(10000);
        Page<Lead> leads = leadService.findLeads(user.getWorkspaceId(), filter);
        StringBuilder csv = new StringBuilder("First Name,Last Name,Email,Phone,Company,Industry,City,Status,Score\n");
        leads.getContent().forEach(l -> csv.append(String.format("%s,%s,%s,%s,%s,%s,%s,%s,%d\n",
                safe(l.getFirstName()), safe(l.getLastName()), safe(l.getEmail()),
                safe(l.getPhone()), safe(l.getCompany()), safe(l.getIndustry()),
                safe(l.getCity()), l.getStatus(), l.getScore())));
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=leads.csv")
                .header("Content-Type", "text/csv")
                .body(csv.toString().getBytes());
    }

    private String safe(String s) {
        return s == null ? "" : "\"" + s.replace("\"", "\"\"") + "\"";
    }
}
