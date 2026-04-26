package com.leadflow.automation.calling;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "callConfigs")
public class CallConfig {

    @Id
    private String id;

    @Indexed
    private String workspaceId;

    private CallProvider provider;
    private String label;
    private Map<String, String> encryptedCredentials;
    private String fromNumber;
    private boolean isDefault = false;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(String workspaceId) { this.workspaceId = workspaceId; }
    public CallProvider getProvider() { return provider; }
    public void setProvider(CallProvider provider) { this.provider = provider; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getFromNumber() { return fromNumber; }
    public void setFromNumber(String fromNumber) { this.fromNumber = fromNumber; }
    public boolean isDefault() { return isDefault; }
    public void setDefault(boolean aDefault) { isDefault = aDefault; }

    public enum CallProvider {
        TWILIO, EXOTEL, PLIVO, VAPI, KNOWLARITY, SERVETEL
    }
}
