package com.leadflow.subscription;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
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

    @CreatedDate
    private Instant createdAt;

    public enum Plan { FREE, PRO, ENTERPRISE }
    public enum Status { ACTIVE, EXPIRED, CANCELLED }
}
