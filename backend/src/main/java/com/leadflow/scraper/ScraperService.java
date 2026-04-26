package com.leadflow.scraper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leadflow.lead.Lead;
import com.leadflow.lead.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ScraperService {

    private final LeadService leadService;
    private final ObjectMapper objectMapper;

    @Value("${scraper.service.url:http://localhost:3001}")
    private String scraperServiceUrl;

    public Map<String, Object> runScraper(String workspaceId, ScraperConfig config) {
        try {
            WebClient client = WebClient.builder().baseUrl(scraperServiceUrl).build();
            String response = client.post()
                    .uri("/scrape")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of(
                            "platform", config.getPlatform(),
                            "url", config.getTargetUrl(),
                            "fields", config.getExtractFields() != null ? config.getExtractFields() : List.of()
                    ))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(response);
            JsonNode leadsNode = root.get("leads");
            int saved = 0;
            if (leadsNode != null && leadsNode.isArray()) {
                for (JsonNode item : leadsNode) {
                    Lead lead = new Lead();
                    lead.setWorkspaceId(workspaceId);
                    lead.setSource(config.getPlatform());
                    if (item.has("email")) lead.setEmail(item.get("email").asText());
                    if (item.has("name")) lead.setFirstName(item.get("name").asText());
                    if (item.has("company")) lead.setCompany(item.get("company").asText());
                    if (item.has("phone")) lead.setPhone(item.get("phone").asText());
                    if (lead.getEmail() != null) {
                        leadService.saveOrUpdate(lead);
                        saved++;
                    }
                }
            }
            return Map.of("leadsAdded", saved, "status", "completed");
        } catch (Exception e) {
            return Map.of("leadsAdded", 0, "status", "failed", "error", e.getMessage());
        }
    }
}
