package org.example.dto;

//import lombok.*;

//@Data
//@NoArgsConstructor
//@AllArgsConstructor
public class FinancialInfoDTO {
    private Double creditScore;        // Credit score of the applicant
    private String bankAccount;        // Bank account number
    private String existingLoans;      // Details of existing loans (e.g., "Car Loan, Personal Loan")
    private Double existingLoanAmount; // Total outstanding loan amount

    public String getAssets() {
        return assets;
    }

    public void setAssets(String assets) {
        this.assets = assets;
    }

    public Double getExistingLoanAmount() {
        return existingLoanAmount;
    }

    public void setExistingLoanAmount(Double existingLoanAmount) {
        this.existingLoanAmount = existingLoanAmount;
    }

    public String getExistingLoans() {
        return existingLoans;
    }

    public void setExistingLoans(String existingLoans) {
        this.existingLoans = existingLoans;
    }

    public String getBankAccount() {
        return bankAccount;
    }

    public void setBankAccount(String bankAccount) {
        this.bankAccount = bankAccount;
    }

    public Double getCreditScore() {
        return creditScore;
    }

    public void setCreditScore(Double creditScore) {
        this.creditScore = creditScore;
    }

    private String assets;             // List of assets (e.g., "Property, Savings")
}