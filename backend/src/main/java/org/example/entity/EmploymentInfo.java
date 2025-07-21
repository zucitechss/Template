package org.example.entity;

import jakarta.persistence.*;
//import lombok.*;

@Entity
//Data
//@NoArgsConstructor
//@AllArgsConstructor
public class EmploymentInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String employmentType;     // Full-time, Part-time, Self-employed
    private String companyName;        // Name of the company
    private Double monthlyIncome;      // Monthly salary or income
    private Integer yearsExperience;   // Total years of experience
    private String employerContact;    // Employer's contact number or email

    public LoanApplication getLoanApplication() {
        return loanApplication;
    }

    public void setLoanApplication(LoanApplication loanApplication) {
        this.loanApplication = loanApplication;
    }

    public String getEmployerContact() {
        return employerContact;
    }

    public void setEmployerContact(String employerContact) {
        this.employerContact = employerContact;
    }

    public Integer getYearsExperience() {
        return yearsExperience;
    }

    public void setYearsExperience(Integer yearsExperience) {
        this.yearsExperience = yearsExperience;
    }

    public Double getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(Double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @OneToOne
    @JoinColumn(name = "loan_application_id")
    private LoanApplication loanApplication;
}

