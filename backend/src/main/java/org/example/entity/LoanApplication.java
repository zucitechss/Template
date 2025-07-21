package org.example.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
//import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
public class LoanApplication {
    @JsonManagedReference
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "applicant_id")
    private User applicant;

    @ManyToOne
    @JoinColumn(name = "loan_officer_id")
    private User loanOfficer;

    private String loanType;      // Personal, Home, Car, etc.
    private Double loanAmount;
    private Integer tenure;
    private LocalDate emiDate;         // Added EMI Date field
    private String status;        // PENDING, IN_PROGRESS, APPROVED, REJECTED, ESCALATED
    private String remarks;

    @CreationTimestamp
    private LocalDateTime appliedDate;

    @UpdateTimestamp
    private LocalDateTime lastUpdatedDate;

    // Relationships with other tables
    @OneToOne(mappedBy = "loanApplication", cascade = CascadeType.ALL)
    private PersonalInfo personalInfo;

    @OneToOne(mappedBy = "loanApplication", cascade = CascadeType.ALL)
    private EmploymentInfo employmentInfo;

    @OneToOne(mappedBy = "loanApplication", cascade = CascadeType.ALL)
    private FinancialInfo financialInfo;

    @OneToOne(mappedBy = "loanApplication", cascade = CascadeType.ALL)
    private DocumentInfo documentInfo;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getApplicant() {
        return applicant;
    }

    public void setApplicant(User applicant) {
        this.applicant = applicant;
    }

    public User getLoanOfficer() {
        return loanOfficer;
    }

    public void setLoanOfficer(User loanOfficer) {
        this.loanOfficer = loanOfficer;
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

    public LocalDateTime getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(LocalDateTime appliedDate) {
        this.appliedDate = appliedDate;
    }

    public LocalDateTime getLastUpdatedDate() {
        return lastUpdatedDate;
    }

    public void setLastUpdatedDate(LocalDateTime lastUpdatedDate) {
        this.lastUpdatedDate = lastUpdatedDate;
    }

    public PersonalInfo getPersonalInfo() {
        return personalInfo;
    }

    public void setPersonalInfo(PersonalInfo personalInfo) {
        this.personalInfo = personalInfo;
    }

    public EmploymentInfo getEmploymentInfo() {
        return employmentInfo;
    }

    public void setEmploymentInfo(EmploymentInfo employmentInfo) {
        this.employmentInfo = employmentInfo;
    }

    public FinancialInfo getFinancialInfo() {
        return financialInfo;
    }

    public void setFinancialInfo(FinancialInfo financialInfo) {
        this.financialInfo = financialInfo;
    }

    public DocumentInfo getDocumentInfo() {
        return documentInfo;
    }

    public void setDocumentInfo(DocumentInfo documentInfo) {
        this.documentInfo = documentInfo;
    }
}
