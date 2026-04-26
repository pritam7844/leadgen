package com.leadflow.subscription;

import com.leadflow.common.response.ApiResponse;
import com.leadflow.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionController {

    private final SubscriptionRepository subscriptionRepository;

    public SubscriptionController(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    @GetMapping("/plans")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getPlans() {
        List<Map<String, Object>> plans = List.of(
                Map.of("name", "FREE", "price", 0, "currency", "INR",
                        "leadsLimit", 500, "features", List.of("CSV upload", "1 integration", "Basic email")),
                Map.of("name", "PRO", "price", 2999, "currency", "INR",
                        "leadsLimit", -1, "features", List.of("Unlimited leads", "All integrations",
                                "All calling providers", "All WhatsApp providers", "Campaigns", "Team members")),
                Map.of("name", "ENTERPRISE", "price", 9999, "currency", "INR",
                        "leadsLimit", -1, "features", List.of("Everything in Pro", "White-label",
                                "Dedicated scraper", "Priority support", "Custom limits"))
        );
        return ResponseEntity.ok(ApiResponse.ok(plans));
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<Subscription>> getCurrent(@AuthenticationPrincipal User user) {
        Subscription sub = subscriptionRepository.findByWorkspaceId(user.getWorkspaceId())
                .orElseGet(() -> {
                    Subscription s = new Subscription();
                    s.setUserId(user.getId());
                    s.setWorkspaceId(user.getWorkspaceId());
                    return subscriptionRepository.save(s);
                });
        return ResponseEntity.ok(ApiResponse.ok(sub));
    }

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<Map<String, String>>> checkout(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "orderId", "order_" + System.currentTimeMillis(),
                "gateway", body.getOrDefault("gateway", "RAZORPAY")
        )));
    }

    @PostMapping("/webhook/razorpay")
    public ResponseEntity<String> razorpayWebhook(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok("ok");
    }

    @PostMapping("/webhook/stripe")
    public ResponseEntity<String> stripeWebhook(@RequestBody String payload) {
        return ResponseEntity.ok("ok");
    }
}
