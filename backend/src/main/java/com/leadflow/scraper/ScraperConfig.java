package com.leadflow.scraper;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
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

    @Data
    public static class Schedule {
        private boolean enabled = false;
        private String cron;
    }
}
