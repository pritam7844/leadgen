package com.leadflow.scraper;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "scraperSources")
public class ScraperConfig {

    @Id
    private String id;
    private String workspaceId;
    private String platform;
    private boolean isEnabled = false;
    private String targetUrl;
    private List<String> extractFields;
    private Schedule schedule = new Schedule();
    private Instant lastRun;
    private String status;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(String workspaceId) { this.workspaceId = workspaceId; }
    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }
    public boolean isEnabled() { return isEnabled; }
    public void setEnabled(boolean enabled) { isEnabled = enabled; }
    public String getTargetUrl() { return targetUrl; }
    public void setTargetUrl(String targetUrl) { this.targetUrl = targetUrl; }
    public List<String> getExtractFields() { return extractFields; }
    public void setExtractFields(List<String> extractFields) { this.extractFields = extractFields; }
    public Schedule getSchedule() { return schedule; }
    public void setSchedule(Schedule schedule) { this.schedule = schedule; }

    public static class Schedule {
        private boolean enabled = false;
        private String cron;
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        public String getCron() { return cron; }
        public void setCron(String cron) { this.cron = cron; }
    }
}
