package com.leadflow.automation.email;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "emailProviders")
public class EmailProvider {

    @Id
    private String id;

    @Indexed
    private String workspaceId;

    private String label;
    private String host;
    private int port = 587;
    private String username;
    private String encryptedPassword;
    private String fromName;
    private String fromEmail;
    private String replyToEmail;
    private boolean isDefault = false;
    private boolean isActive = true;
}
