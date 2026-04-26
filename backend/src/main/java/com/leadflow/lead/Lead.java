package com.leadflow.lead;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "leads")
public class Lead {

    @Id
    private String id;

    @Indexed
    private String workspaceId;

    private String firstName;
    private String lastName;

    @Indexed
    private String email;

    private String phone;
    private String company;
    private String industry;
    private String companySize;
    private String location;
    private String city;
    private String region;
    private String source;
    private String sourceId;
    private Status status = Status.NEW;
    private Integer score = 0;
    private List<String> tags = new ArrayList<>();
    private Map<String, Object> customFields = new HashMap<>();
    private Instant lastContactedAt;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public enum Status {
        NEW, CONTACTED, QUALIFIED, MEETING_BOOKED, CONVERTED, DEAD
    }
}
