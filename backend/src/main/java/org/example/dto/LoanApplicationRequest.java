package org.example.dto;

//import lombok.*;
import java.time.LocalDate;

//@Data
//@NoArgsConstructor
//@AllArgsConstructor
public class LoanApplicationRequest {
    private Long applicantId;
    private String loanType;
    private Double loanAmount;

    public Long getApplicantId() {
        return applicantId;
    }

    public void setApplicantId(Long applicantId) {
        this.applicantId = applicantId;
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

    public Integer getTenure() {
        return tenure;
    }

    public void setTenure(Integer tenure) {
        this.tenure = tenure;
    }

    public LocalDate getEmiDate() {
        return emiDate;
    }

    public void setEmiDate(LocalDate emiDate) {
        this.emiDate = emiDate;
    }

    public PersonalInfoDTO getPersonalInfo() {
        return personalInfo;
    }

    public void setPersonalInfo(PersonalInfoDTO personalInfo) {
        this.personalInfo = personalInfo;
    }

    public EmploymentInfoDTO getEmploymentInfo() {
        return employmentInfo;
    }

    public void setEmploymentInfo(EmploymentInfoDTO employmentInfo) {
        this.employmentInfo = employmentInfo;
    }

    public FinancialInfoDTO getFinancialInfo() {
        return financialInfo;
    }

    public void setFinancialInfo(FinancialInfoDTO financialInfo) {
        this.financialInfo = financialInfo;
    }

    public DocumentInfoDTO getDocumentInfo() {
        return documentInfo;
    }

    public void setDocumentInfo(DocumentInfoDTO documentInfo) {
        this.documentInfo = documentInfo;
    }

    private Integer tenure;
    private LocalDate emiDate;         // Added EMI Date field

    private PersonalInfoDTO personalInfo;
    private EmploymentInfoDTO employmentInfo;
    private FinancialInfoDTO financialInfo;
    private DocumentInfoDTO documentInfo;
}
