package org.example.dto;

//import lombok.*;

//@Data
public class LoanDecisionRequest {
    private Long applicationId;
    private String status;  // APPROVED, REJECTED, ESCALATED
    private String remarks;

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
