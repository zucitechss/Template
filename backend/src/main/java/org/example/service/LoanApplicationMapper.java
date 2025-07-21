package org.example.service;

import org.example.dto.*;
import org.example.entity.LoanApplication;
import org.example.utilities.TokenUtil;

import java.time.format.DateTimeFormatter;

public class LoanApplicationMapper {

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static LoanApplicationResponse mapToLoanApplicationResponse(LoanApplication loanApplication) {
        LoanApplicationResponse response = new LoanApplicationResponse();

        // Basic fields
        response.setId(loanApplication.getId());
        response.setRemarks(loanApplication.getRemarks());
        response.setStatus(loanApplication.getStatus());
        response.setApplicantId(loanApplication.getApplicant().getId());
        response.setLoanType(loanApplication.getLoanType());
        response.setLoanAmount(loanApplication.getLoanAmount());
        response.setTenure(loanApplication.getTenure());

        // Dates
        if (loanApplication.getAppliedDate() != null) {
            response.setAppliedDate(loanApplication.getAppliedDate().format(formatter));
        }
        if (loanApplication.getEmiDate() != null) {
            response.setEmiDate(loanApplication.getEmiDate().format(formatter));
        }
        if (loanApplication.getLastUpdatedDate() != null) {
            response.setLastUpdatedDate(loanApplication.getLastUpdatedDate().format(formatter));
        }

        // ✅ Set the secure token for this loan ID
        response.setLoanIdToken(TokenUtil.generateLoanIdToken(loanApplication.getId()));

        // DocumentInfo
        DocumentInfoDTO documentInfoDTO = new DocumentInfoDTO();
        documentInfoDTO.setAddressProof(loanApplication.getDocumentInfo().getAddressProof());
        documentInfoDTO.setIdProof(loanApplication.getDocumentInfo().getIdProof());
        documentInfoDTO.setIncomeProof(loanApplication.getDocumentInfo().getIncomeProof());
        documentInfoDTO.setPhoto(loanApplication.getDocumentInfo().getPhoto());
        response.setDocumentInfo(documentInfoDTO);

        // EmploymentInfo
        EmploymentInfoDTO employmentInfoDTO = new EmploymentInfoDTO();
        employmentInfoDTO.setEmploymentType(loanApplication.getEmploymentInfo().getEmploymentType());
        employmentInfoDTO.setCompanyName(loanApplication.getEmploymentInfo().getCompanyName());
        employmentInfoDTO.setMonthlyIncome(loanApplication.getEmploymentInfo().getMonthlyIncome());
        employmentInfoDTO.setYearsExperience(loanApplication.getEmploymentInfo().getYearsExperience());
        employmentInfoDTO.setEmployerContact(loanApplication.getEmploymentInfo().getEmployerContact());
        response.setEmploymentInfo(employmentInfoDTO);

        // FinancialInfo
        FinancialInfoDTO financialInfoDTO = new FinancialInfoDTO();
        financialInfoDTO.setCreditScore(loanApplication.getFinancialInfo().getCreditScore());
        financialInfoDTO.setBankAccount(loanApplication.getFinancialInfo().getBankAccount());
        financialInfoDTO.setExistingLoans(loanApplication.getFinancialInfo().getExistingLoans());
        financialInfoDTO.setExistingLoanAmount(loanApplication.getFinancialInfo().getExistingLoanAmount());
        financialInfoDTO.setAssets(loanApplication.getFinancialInfo().getAssets());
        response.setFinancialInfo(financialInfoDTO);

        // PersonalInfo
        PersonalInfoDTO personalInfoDTO = new PersonalInfoDTO();
        personalInfoDTO.setFirstName(loanApplication.getPersonalInfo().getFirstName());
        personalInfoDTO.setLastName(loanApplication.getPersonalInfo().getLastName());
        personalInfoDTO.setDob(loanApplication.getPersonalInfo().getDob());
        personalInfoDTO.setGender(loanApplication.getPersonalInfo().getGender());
        personalInfoDTO.setEmail(loanApplication.getPersonalInfo().getEmail());
        response.setPersonalInfo(personalInfoDTO);

        return response;
    }
}
