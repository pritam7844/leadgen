package com.leadflow.subscription;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "subscriptions")
public class Subscription {

    @Id
    private String id;
    private String userId;
    private String workspaceId;
    private Plan plan = Plan.FREE;
    private Status status = Status.ACTIVE;
    private long leadsUsed = 0;
    private long leadsLimit = 500;
    private Instant expiresAt;
    private String paymentGateway;
    private String paymentId;
    private String orderId;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(String workspaceId) { this.workspaceId = workspaceId; }
    public Plan getPlan() { return plan; }
    public void setPlan(Plan plan) { this.plan = plan; }

    @CreatedDate
    private Instant createdAt;

    public enum Plan { FREE, PRO, ENTERPRISE }
    public enum Status { ACTIVE, EXPIRED, CANCELLED }
}
