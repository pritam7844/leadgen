package com.leadflow.automation.campaign;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(String workspaceId) { this.workspaceId = workspaceId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<String> getLeadIds() { return leadIds; }
    public void setLeadIds(List<String> leadIds) { this.leadIds = leadIds; }
    public List<Step> getSteps() { return steps; }
    public void setSteps(List<Step> steps) { this.steps = steps; }
    public Stats getStats() { return stats; }
    public void setStats(Stats stats) { this.stats = stats; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public enum Status { DRAFT, ACTIVE, PAUSED, COMPLETED }

    public static class Step {
        private String stepType;
        private int delayHours;
        private Map<String, Object> config;

        public String getStepType() { return stepType; }
        public void setStepType(String stepType) { this.stepType = stepType; }
        public int getDelayHours() { return delayHours; }
        public void setDelayHours(int delayHours) { this.delayHours = delayHours; }
        public Map<String, Object> getConfig() { return config; }
        public void setConfig(Map<String, Object> config) { this.config = config; }
    }

    public static class Stats {
        private long sent = 0;
        private long opened = 0;
        private long replied = 0;
        private long called = 0;
        private long meetings = 0;

        public long getSent() { return sent; }
        public void setSent(long sent) { this.sent = sent; }
        public long getOpened() { return opened; }
        public void setOpened(long opened) { this.opened = opened; }
        public long getReplied() { return replied; }
        public void setReplied(long replied) { this.replied = replied; }
        public long getCalled() { return called; }
        public void setCalled(long called) { this.called = called; }
        public long getMeetings() { return meetings; }
        public void setMeetings(long meetings) { this.meetings = meetings; }
    }
}
