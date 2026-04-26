package com.leadflow.common.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.Instant;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String message;
    private Instant timestamp;

    public static ErrorResponse of(int status, String message) {
        return new ErrorResponse(status, message, Instant.now());
    }
}
