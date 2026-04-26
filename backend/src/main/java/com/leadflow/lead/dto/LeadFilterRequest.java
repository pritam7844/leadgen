package com.leadflow.lead.dto;

import com.leadflow.lead.Lead;
import lombok.Data;

@Data
public class LeadFilterRequest {
    private Lead.Status status;
    private String industry;
    private String city;
    private String source;
    private Integer minScore;
    private Integer maxScore;
    private String search;
    private int page = 0;
    private int size = 20;
    private String sortBy = "createdAt";
    private String sortDir = "desc";
}
