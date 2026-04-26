package com.leadflow.automation.whatsapp;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "whatsappConfigs")
public class WhatsAppConfig {

    @Id
    private String id;

    @Indexed
    private String workspaceId;

    private WhatsAppProvider provider;
    private String label;
    private Map<String, String> encryptedCredentials;
    private String fromNumber;
    private boolean isDefault = false;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(String workspaceId) { this.workspaceId = workspaceId; }
    public WhatsAppProvider getProvider() { return provider; }
    public void setProvider(WhatsAppProvider provider) { this.provider = provider; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getFromNumber() { return fromNumber; }
    public void setFromNumber(String fromNumber) { this.fromNumber = fromNumber; }
    public boolean isDefault() { return isDefault; }
    public void setDefault(boolean aDefault) { isDefault = aDefault; }

    public enum WhatsAppProvider {
        TWILIO_WA, WATI, INTERAKT, DIALOG_360, GUPSHUP
    }
}
