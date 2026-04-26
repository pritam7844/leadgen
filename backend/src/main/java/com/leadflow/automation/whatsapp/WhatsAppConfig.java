package com.leadflow.automation.whatsapp;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Data
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

    public enum WhatsAppProvider {
        TWILIO_WA, WATI, INTERAKT, DIALOG_360, GUPSHUP
    }
}
