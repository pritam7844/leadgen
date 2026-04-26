package com.leadflow.apikey;

import com.leadflow.common.exception.LeadFlowException;
import com.leadflow.common.util.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final EncryptionUtil encryptionUtil;

    private static final List<String> SUPPORTED_SERVICES = List.of(
            "APOLLO", "GHL", "HUBSPOT", "APIFY", "TWILIO", "EXOTEL", "PLIVO",
            "VAPI", "KNOWLARITY", "SERVETEL", "WATI", "INTERAKT", "360DIALOG",
            "GUPSHUP", "RAZORPAY", "STRIPE", "CLEARBIT", "HUNTER", "ZOOMINFO"
    );

    public List<ApiKey> findByWorkspace(String workspaceId) {
        List<ApiKey> keys = apiKeyRepository.findByWorkspaceId(workspaceId);
        keys.forEach(k -> k.setEncryptedKey(encryptionUtil.mask(k.getEncryptedKey())));
        return keys;
    }

    public ApiKey create(String workspaceId, Map<String, String> body) {
        ApiKey key = new ApiKey();
        key.setWorkspaceId(workspaceId);
        key.setService(body.get("service").toUpperCase());
        key.setLabel(body.get("label"));
        key.setEncryptedKey(encryptionUtil.encrypt(body.get("key")));
        return apiKeyRepository.save(key);
    }

    public void delete(String workspaceId, String id) {
        ApiKey key = apiKeyRepository.findById(id)
                .orElseThrow(() -> new LeadFlowException("API key not found", HttpStatus.NOT_FOUND));
        if (!key.getWorkspaceId().equals(workspaceId))
            throw new LeadFlowException("Access denied", HttpStatus.FORBIDDEN);
        apiKeyRepository.delete(key);
    }

    public String getRawKey(String workspaceId, String service) {
        ApiKey key = apiKeyRepository.findByWorkspaceIdAndService(workspaceId, service)
                .orElseThrow(() -> new LeadFlowException(service + " API key not configured", HttpStatus.NOT_FOUND));
        key.setLastUsedAt(Instant.now());
        apiKeyRepository.save(key);
        return encryptionUtil.decrypt(key.getEncryptedKey());
    }

    public List<String> getSupportedServices() {
        return SUPPORTED_SERVICES;
    }
}
