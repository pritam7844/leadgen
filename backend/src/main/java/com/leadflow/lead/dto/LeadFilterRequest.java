package com.leadflow.lead.dto;

import com.leadflow.lead.Lead;

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

    public Lead.Status getStatus() { return status; }
    public void setStatus(Lead.Status status) { this.status = status; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public Integer getMinScore() { return minScore; }
    public void setMinScore(Integer minScore) { this.minScore = minScore; }
    public Integer getMaxScore() { return maxScore; }
    public void setMaxScore(Integer maxScore) { this.maxScore = maxScore; }
    public String getSearch() { return search; }
    public void setSearch(String search) { this.search = search; }
    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }
    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }
    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }
    public String getSortDir() { return sortDir; }
    public void setSortDir(String sortDir) { this.sortDir = sortDir; }
}
