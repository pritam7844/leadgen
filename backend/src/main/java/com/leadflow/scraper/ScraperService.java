package com.leadflow.scraper;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ScraperService {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public ScraperService(RabbitTemplate rabbitTemplate, ObjectMapper objectMapper) {
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
    }

    public Map<String, Object> runScraper(String workspaceId, ScraperConfig config) {
        try {
            String targetUrl = config.getTargetUrl();
            if ("GOOGLE_MAPS".equals(config.getPlatform()) && (targetUrl == null || targetUrl.isEmpty())) {
                targetUrl = "https://www.google.com/maps/search/businesses+in+Lucknow";
            }

            Map<String, Object> job = Map.of(
                    "platform", config.getPlatform(),
                    "url", targetUrl != null ? targetUrl : "",
                    "workspaceId", workspaceId,
                    "fields", config.getExtractFields() != null ? config.getExtractFields() : List.of()
            );

            rabbitTemplate.convertAndSend("scrape_jobs", job);

            return Map.of("status", "accepted", "message", "Scraper job queued successfully", "leadsAdded", 0);
        } catch (Exception e) {
            return Map.of("status", "failed", "error", e.getMessage(), "leadsAdded", 0);
        }
    }
}
