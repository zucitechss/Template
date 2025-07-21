package org.example.dto;

import org.example.entity.DocumentInfo;
import org.example.entity.EmploymentInfo;
import org.example.entity.FinancialInfo;
import org.example.entity.PersonalInfo;

public class LoanApplicationResponse {
    private Long id;
    private String appliedDate;
    private String emiDate;
    private String lastUpdatedDate;
    private Double loanAmount;
    private String loanType;
    private String remarks;
    private String status;
    private Integer tenure;
    private Long applicantId;
    private Long loanOfficerId;

    // ✅ New field
    private String loanIdToken;

    public String getLoanIdToken() {
        return loanIdToken;
    }

    public void setLoanIdToken(String loanIdToken) {
        this.loanIdToken = loanIdToken;
    }

    public PersonalInfoDTO getPersonalInfo() {
        return personalInfo;
    }

    public void setPersonalInfo(PersonalInfoDTO personalInfo) {
        this.personalInfo = personalInfo;
    }

    public Integer getTenure() {
        return tenure;
    }

    public void setTenure(Integer tenure) {
        this.tenure = tenure;
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

    public String getLoanType() {
        return loanType;
    }

    public void setLoanType(String loanType) {
        this.loanType = loanType;
    }

    public Double getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(Double loanAmount) {
        this.loanAmount = loanAmount;
    }

    public Long getLoanOfficerId() {
        return loanOfficerId;
    }

    public void setLoanOfficerId(Long loanOfficerId) {
        this.loanOfficerId = loanOfficerId;
    }

    public String getLastUpdatedDate() {
        return lastUpdatedDate;
    }

    public void setLastUpdatedDate(String lastUpdatedDate) {
        this.lastUpdatedDate = lastUpdatedDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FinancialInfoDTO getFinancialInfo() {
        return financialInfo;
    }

    public void setFinancialInfo(FinancialInfoDTO financialInfo) {
        this.financialInfo = financialInfo;
    }

    public EmploymentInfoDTO getEmploymentInfo() {
        return employmentInfo;
    }

    public void setEmploymentInfo(EmploymentInfoDTO employmentInfo) {
        this.employmentInfo = employmentInfo;
    }

    public String getEmiDate() {
        return emiDate;
    }

    public void setEmiDate(String emiDate) {
        this.emiDate = emiDate;
    }

    public DocumentInfoDTO getDocumentInfo() {
        return documentInfo;
    }

    public void setDocumentInfo(DocumentInfoDTO documentInfo) {
        this.documentInfo = documentInfo;
    }

    public String getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(String appliedDate) {
        this.appliedDate = appliedDate;
    }

    public Long getApplicantId() {
        return applicantId;
    }

    public void setApplicantId(Long applicantId) {
        this.applicantId = applicantId;
    }

    // Use DTOs instead of entities
    private PersonalInfoDTO personalInfo;
    private EmploymentInfoDTO employmentInfo;
    private FinancialInfoDTO financialInfo;
    private DocumentInfoDTO documentInfo;

    // Getters and setters...
}
