package org.example.dto;

import org.example.entity.LoanApplication;

public class LoanDecisionResponse {
    private boolean confirmationStatus;
    private String message;

    // Constructor
    public LoanDecisionResponse(boolean confirmationStatus, String message) {
        this.confirmationStatus = confirmationStatus;
        this.message = message;
    }

    // Getters and Setters
    public boolean isConfirmationStatus() {
        return confirmationStatus;
    }

    public void setConfirmationStatus(boolean confirmationStatus) {
        this.confirmationStatus = confirmationStatus;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
