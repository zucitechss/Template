package org.example.dto;

//import lombok.*;

//@Data
public class LoanAssignmentRequest {
    private Long applicationId;
    private Long loanOfficerId;

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public Long getLoanOfficerId() {
        return loanOfficerId;
    }

    public void setLoanOfficerId(Long loanOfficerId) {
        this.loanOfficerId = loanOfficerId;
    }
}