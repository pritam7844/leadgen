package com.leadflow.common.exception;

import java.time.Instant;

public class ErrorResponse {
    private int status;
    private String message;
    private Instant timestamp;

    public ErrorResponse() {}
    public ErrorResponse(int status, String message, Instant timestamp) {
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
    }

    public int getStatus() { return status; }
    public String getMessage() { return message; }
    public Instant getTimestamp() { return timestamp; }

    public static ErrorResponse of(int status, String message) {
        return new ErrorResponse(status, message, Instant.now());
    }
}
