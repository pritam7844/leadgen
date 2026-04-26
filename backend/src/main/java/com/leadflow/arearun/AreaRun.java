package com.leadflow.arearun;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
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

    public enum Status { RUNNING, COMPLETED, FAILED }

    @Data
    public static class Filters {
        private String region;
        private String city;
        private List<String> industries;
        private List<String> companySizes;
        private List<String> sources;
    }
}
