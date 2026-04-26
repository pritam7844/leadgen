package com.leadflow.lead.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class LeadRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String company;
    private String industry;
    private String companySize;
    private String location;
    private String city;
    private String region;
    private String source;
    private List<String> tags;
    private Map<String, Object> customFields;
}
