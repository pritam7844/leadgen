package com.leadflow.arearun;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "areaRuns")
public class AreaRun {

    @Id
    private String id;

    private String workspaceId;
    private Filters filters;
    private Status status = Status.RUNNING;
    private long leadsAdded = 0;
    private List<String> errors;
    private Instant startedAt = Instant.now();
    private Instant completedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(String workspaceId) { this.workspaceId = workspaceId; }
    public Filters getFilters() { return filters; }
    public void setFilters(Filters filters) { this.filters = filters; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public long getLeadsAdded() { return leadsAdded; }
    public void setLeadsAdded(long leadsAdded) { this.leadsAdded = leadsAdded; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }

    public enum Status { RUNNING, COMPLETED, FAILED }

    public static class Filters {
        private String region;
        private String city;
        private List<String> industries;
        private List<String> companySizes;
        private List<String> sources;

        public String getRegion() { return region; }
        public void setRegion(String region) { this.region = region; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public List<String> getIndustries() { return industries; }
        public void setIndustries(List<String> industries) { this.industries = industries; }
    }
}
