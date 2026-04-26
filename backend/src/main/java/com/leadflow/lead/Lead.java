package com.leadflow.lead;

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

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(String workspaceId) { this.workspaceId = workspaceId; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public void setCustomFields(Map<String, Object> customFields) { this.customFields = customFields; }
    public void setCompanySize(String companySize) { this.companySize = companySize; }
    public void setRegion(String region) { this.region = region; }

    public enum Status {
        NEW, CONTACTED, QUALIFIED, MEETING_BOOKED, CONVERTED, DEAD
    }
}
