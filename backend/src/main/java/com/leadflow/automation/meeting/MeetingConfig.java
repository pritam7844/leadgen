package com.leadflow.automation.meeting;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Map;

@Data
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

    public enum MeetingProvider { CALENDLY, CAL_COM, GOOGLE_CALENDAR }
}
