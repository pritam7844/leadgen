package com.leadflow.automation.email;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(String workspaceId) { this.workspaceId = workspaceId; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getHost() { return host; }
    public void setHost(String host) { this.host = host; }
    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEncryptedPassword() { return encryptedPassword; }
    public void setEncryptedPassword(String encryptedPassword) { this.encryptedPassword = encryptedPassword; }
    public String getFromName() { return fromName; }
    public void setFromName(String fromName) { this.fromName = fromName; }
    public String getFromEmail() { return fromEmail; }
    public void setFromEmail(String fromEmail) { this.fromEmail = fromEmail; }
    public String getReplyToEmail() { return replyToEmail; }
    public void setReplyToEmail(String replyToEmail) { this.replyToEmail = replyToEmail; }
    public boolean isDefault() { return isDefault; }
    public void setDefault(boolean aDefault) { isDefault = aDefault; }
}
