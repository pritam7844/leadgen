package com.leadflow.automation.campaign;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "campaigns")
public class Campaign {

    @Id
    private String id;

    @Indexed
    private String workspaceId;

    private String name;
    private List<Step> steps = new ArrayList<>();
    private List<String> leadIds = new ArrayList<>();
    private Status status = Status.DRAFT;
    private Stats stats = new Stats();

    @CreatedDate
    private Instant createdAt;

    public enum Status { DRAFT, ACTIVE, PAUSED, COMPLETED }

    @Data
    public static class Step {
        private String stepType;
        private int delayHours;
        private Map<String, Object> config;
    }

    @Data
    public static class Stats {
        private long sent = 0;
        private long opened = 0;
        private long replied = 0;
        private long called = 0;
        private long meetings = 0;
    }
}
