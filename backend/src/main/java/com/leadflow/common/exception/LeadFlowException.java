package com.leadflow.common.exception;

import org.springframework.http.HttpStatus;

public class LeadFlowException extends RuntimeException {
    private final HttpStatus status;

    public LeadFlowException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public LeadFlowException(String message) {
        this(message, HttpStatus.BAD_REQUEST);
    }

    public HttpStatus getStatus() {
        return status;
    }
}
