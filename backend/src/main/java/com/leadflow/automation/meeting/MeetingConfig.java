package com.leadflow.automation.meeting;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Document(collection = "meetingConfigs")
public class MeetingConfig {

    @Id
    private String id;

    @Indexed
    private String workspaceId;

    private MeetingProvider provider;
    private Map<String, String> encryptedCredentials;
    private String bookingLink;
    private boolean isDefault = false;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(String workspaceId) { this.workspaceId = workspaceId; }
    public MeetingProvider getProvider() { return provider; }
    public void setProvider(MeetingProvider provider) { this.provider = provider; }
    public boolean isDefault() { return isDefault; }
    public void setDefault(boolean aDefault) { isDefault = aDefault; }

    public enum MeetingProvider { CALENDLY, CAL_COM, GOOGLE_CALENDAR }
}
