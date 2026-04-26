package com.leadflow.automation.calling;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Data
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

    public enum CallProvider {
        TWILIO, EXOTEL, PLIVO, VAPI, KNOWLARITY, SERVETEL
    }
}
