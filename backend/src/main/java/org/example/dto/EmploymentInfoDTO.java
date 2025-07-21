package org.example.dto;


//import lombok.*;

//@Data
//@NoArgsConstructor
//@AllArgsConstructor
public class EmploymentInfoDTO {
    private String employmentType;     // Full-time, Part-time, Self-employed

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Double getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(Double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public Integer getYearsExperience() {
        return yearsExperience;
    }

    public void setYearsExperience(Integer yearsExperience) {
        this.yearsExperience = yearsExperience;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public String getEmployerContact() {
        return employerContact;
    }

    public void setEmployerContact(String employerContact) {
        this.employerContact = employerContact;
    }

    private String companyName;        // Name of the company
    private Double monthlyIncome;      // Monthly salary or income
    private Integer yearsExperience;   // Total years of experience
    private String employerContact;    // Employer's contact number or email
}