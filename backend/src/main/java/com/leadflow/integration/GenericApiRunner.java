package com.leadflow.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leadflow.lead.Lead;
import com.leadflow.lead.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class GenericApiRunner {

    private final LeadService leadService;
    private final ObjectMapper objectMapper;

    public int run(String workspaceId, IntegrationConfig config) {
        WebClient client = WebClient.builder()
                .baseUrl(config.getApiEndpoint())
                .defaultHeaders(headers -> applyAuth(headers, config))
                .build();

        String responseBody = executeRequest(client, config);
        List<Lead> leads = parseLeads(responseBody, config, workspaceId);

        int saved = 0;
        for (Lead lead : leads) {
            leadService.saveOrUpdate(lead);
            saved++;
        }
        return saved;
    }

    private void applyAuth(org.springframework.http.HttpHeaders headers, IntegrationConfig config) {
        if (config.getAuthType() == null || config.getEncryptedAuthValue() == null) return;
        switch (config.getAuthType()) {
            case "BEARER" -> headers.setBearerAuth(config.getEncryptedAuthValue());
            case "API_KEY_HEADER" -> headers.set("X-API-Key", config.getEncryptedAuthValue());
            case "BASIC" -> headers.setBasicAuth(config.getEncryptedAuthValue());
        }
    }

    private String executeRequest(WebClient client, IntegrationConfig config) {
        WebClient.RequestHeadersSpec<?> spec = "POST".equals(config.getMethod())
                ? client.post().bodyValue(config.getRequestBody() != null ? config.getRequestBody() : "{}")
                : client.get();
        return spec.retrieve().bodyToMono(String.class).block();
    }

    private List<Lead> parseLeads(String responseBody, IntegrationConfig config, String workspaceId) {
        List<Lead> leads = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode items = config.getResponsePath() != null
                    ? root.at(config.getResponsePath())
                    : root;

            if (!items.isArray()) return leads;

            for (JsonNode item : items) {
                Lead lead = new Lead();
                lead.setWorkspaceId(workspaceId);
                lead.setSource(config.getName());

                if (config.getFieldMappings() != null) {
                    for (IntegrationConfig.FieldMapping mapping : config.getFieldMappings()) {
                        JsonNode value = item.get(mapping.getSourceField());
                        if (value != null) applyMapping(lead, mapping.getTargetField(), value.asText());
                    }
                }
                if (lead.getEmail() != null) leads.add(lead);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse API response: " + e.getMessage());
        }
        return leads;
    }

    private void applyMapping(Lead lead, String field, String value) {
        switch (field) {
            case "email" -> lead.setEmail(value);
            case "firstName" -> lead.setFirstName(value);
            case "lastName" -> lead.setLastName(value);
            case "phone" -> lead.setPhone(value);
            case "company" -> lead.setCompany(value);
            case "industry" -> lead.setIndustry(value);
            case "city" -> lead.setCity(value);
        }
    }
}
