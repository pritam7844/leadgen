package com.leadflow.source.types;

import com.leadflow.lead.Lead;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvImportService {

    private static final int MAX_ROWS = 50000;

    public List<Lead> importCsv(String workspaceId, MultipartFile file) {
        List<Lead> leads = new ArrayList<>();
        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVParser parser = CSVFormat.DEFAULT.builder()
                     .setHeader()
                     .setSkipHeaderRecord(true)
                     .setTrim(true)
                     .build()
                     .parse(reader)) {

            int rowCount = 0;
            for (CSVRecord record : parser) {
                if (rowCount++ >= MAX_ROWS) break;
                Lead lead = mapRecord(record, workspaceId);
                if (isValid(lead)) leads.add(lead);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV: " + e.getMessage());
        }
        return leads;
    }

    private Lead mapRecord(CSVRecord record, String workspaceId) {
        Lead lead = new Lead();
        lead.setWorkspaceId(workspaceId);
        lead.setFirstName(getField(record, "first_name", "firstName", "First Name", "first name"));
        lead.setLastName(getField(record, "last_name", "lastName", "Last Name", "last name"));
        lead.setEmail(getField(record, "email", "Email", "EMAIL", "e-mail"));
        lead.setPhone(getField(record, "phone", "Phone", "mobile", "contact"));
        lead.setCompany(getField(record, "company", "Company", "company_name", "organization"));
        lead.setIndustry(getField(record, "industry", "Industry", "sector"));
        lead.setCity(getField(record, "city", "City", "location"));
        lead.setSource("CSV");
        return lead;
    }

    private String getField(CSVRecord record, String... keys) {
        for (String key : keys) {
            try {
                String val = record.get(key);
                if (val != null && !val.isBlank()) return sanitize(val);
            } catch (IllegalArgumentException ignored) {}
        }
        return null;
    }

    private String sanitize(String value) {
        return value.replaceAll("[<>\"']", "").trim();
    }

    private boolean isValid(Lead lead) {
        return lead.getEmail() != null && lead.getEmail().contains("@");
    }
}
