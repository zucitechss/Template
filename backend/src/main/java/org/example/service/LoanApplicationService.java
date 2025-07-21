package org.example.service;

import org.example.dto.*;
import org.example.entity.*;
import org.example.repository.*;
//import lombok.RequiredArgsConstructor;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.example.repository.LoanApplicationRepository;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
//@RequiredArgsConstructor
public class LoanApplicationService {

    private final LoanApplicationRepository loanRepo;
    private final PersonalInfoRepository personalRepo;
    private final EmploymentInfoRepository employmentRepo;
    private final FinancialInfoRepository financialRepo;
    private final DocumentInfoRepository documentRepo;
    private final UserRepository userRepo;

    public LoanApplicationService(LoanApplicationRepository loanRepo,
                                  PersonalInfoRepository personalRepo,
                                  EmploymentInfoRepository employmentRepo,
                                  FinancialInfoRepository financialRepo,
                                  DocumentInfoRepository documentRepo,
                                  UserRepository userRepo) {
        this.loanRepo = loanRepo;
        this.personalRepo = personalRepo;
        this.employmentRepo = employmentRepo;
        this.financialRepo = financialRepo;
        this.documentRepo = documentRepo;
        this.userRepo = userRepo;
    }

    private static final Logger logger = LoggerFactory.getLogger(LoanApplicationService.class);
    // Apply for Loan
    @Transactional
    public LoanApplication applyForLoan(LoanApplicationRequest request, String username) {
        try {
            // Log the values received in the request for debugging
            logger.info("Loan Type: {}", request.getLoanType());
            logger.info("Loan Amount: {}", request.getLoanAmount());
            logger.info("Tenure: {}", request.getTenure());
            logger.info("EMI Date: {}", request.getEmiDate());
            // Manually set the applicantId to 15 (for testing purposes, adjust as needed)
            //request.setApplicantId(12L); // Set the applicantId to 2 (or fetch it dynamically)

            // Retrieve the applicant using the applicantId
            //User applicant = userRepo.findById(request.getApplicantId())
                //.orElseThrow(() -> {
            //logger.error("Applicant with ID {} not found.", request.getApplicantId());
            //return new RuntimeException("Applicant not found");
            //});

            // Retrieve the applicant using the applicantId
            User applicant = userRepo.findByEmail(username)
                    .orElseThrow(() -> {
                        return new UsernameNotFoundException("User not found");
                    });

            // Logging personal information for verification
            logger.info("Personal Info: First Name: {}, Last Name: {}, Email: {}",
                    request.getPersonalInfo().getFirstName(),
                    request.getPersonalInfo().getLastName(),
                    request.getPersonalInfo().getEmail());

            // Ensure the LoanApplication object has the required data from the LoanApplicationRequest
            LoanApplication loan = new LoanApplication();
            loan.setApplicant(applicant);           // Set applicant for the loan application
            loan.setLoanType(request.getLoanType());  // Set loan type
            loan.setLoanAmount(request.getLoanAmount()); // Set loan amount
            loan.setTenure(request.getTenure());     // Set tenure
            loan.setEmiDate(request.getEmiDate());   // Set EMI date
            loan.setStatus("PENDING");               // Default status

            // Dynamically assign the loan officer before saving the loan application using round-robin
            assignLoanOfficer(loan);
            // Save the LoanApplication entity
            LoanApplication savedLoan = loanRepo.save(loan);

            // Now save other entities like PersonalInfo, EmploymentInfo, FinancialInfo, DocumentInfo
            savePersonalInfo(request, savedLoan);
            saveEmploymentInfo(request, savedLoan);
            saveFinancialInfo(request, savedLoan);
            saveDocumentInfo(request, savedLoan);

            return savedLoan;
        } catch (Exception e) {
            logger.error("Error while applying for loan for applicant ID {}: {}", request.getApplicantId(), e.getMessage());
            throw e; // or handle gracefully
        }
    }

    // Method to save personal information
    private void savePersonalInfo(LoanApplicationRequest request, LoanApplication loan) {
        PersonalInfo personal = new PersonalInfo();
        personal.setFirstName(request.getPersonalInfo().getFirstName());
        personal.setLastName(request.getPersonalInfo().getLastName());
        personal.setGender(request.getPersonalInfo().getGender());
        personal.setDob(request.getPersonalInfo().getDob());
        personal.setEmail(request.getPersonalInfo().getEmail());
        personal.setPhone(request.getPersonalInfo().getPhone());
        personal.setAddress(request.getPersonalInfo().getAddress());
        personal.setMaritalStatus(request.getPersonalInfo().getMaritalStatus());
        personal.setLoanApplication(loan); // Linking personal info to the loan application
        personalRepo.save(personal);
    }

    // Method to save employment information
    private void saveEmploymentInfo(LoanApplicationRequest request, LoanApplication loan) {
        EmploymentInfo employment = new EmploymentInfo();
        employment.setEmploymentType(request.getEmploymentInfo().getEmploymentType());
        employment.setCompanyName(request.getEmploymentInfo().getCompanyName());
        employment.setMonthlyIncome(request.getEmploymentInfo().getMonthlyIncome());
        employment.setYearsExperience(request.getEmploymentInfo().getYearsExperience());
        employment.setEmployerContact(request.getEmploymentInfo().getEmployerContact());
        employment.setLoanApplication(loan); // Linking employment info to the loan application
        employmentRepo.save(employment);
    }

    // Method to save financial information
    private void saveFinancialInfo(LoanApplicationRequest request, LoanApplication loan) {
        FinancialInfo financial = new FinancialInfo();
        financial.setCreditScore(request.getFinancialInfo().getCreditScore());
        financial.setBankAccount(request.getFinancialInfo().getBankAccount());
        financial.setExistingLoans(request.getFinancialInfo().getExistingLoans());
        financial.setExistingLoanAmount(request.getFinancialInfo().getExistingLoanAmount());
        financial.setAssets(request.getFinancialInfo().getAssets());
        financial.setLoanApplication(loan); // Linking financial info to the loan application
        financialRepo.save(financial);
    }

    // Method to save document information
    private void saveDocumentInfo(LoanApplicationRequest request, LoanApplication loan) {
        DocumentInfo document = new DocumentInfo();
        document.setIdProof(request.getDocumentInfo().getIdProof());
        document.setIncomeProof(request.getDocumentInfo().getIncomeProof());
        document.setAddressProof(request.getDocumentInfo().getAddressProof());
        document.setPhoto(request.getDocumentInfo().getPhoto());
        document.setLoanApplication(loan); // Linking document info to the loan application
        documentRepo.save(document);
    }

    // Modify this method to return LoanApplicationResponse instead of LoanApplication
    public List<LoanApplicationResponse> getAllLoanApplications() {
        List<LoanApplication> applications = loanRepo.findAll();

        // Map LoanApplication entities to LoanApplicationResponse DTOs
        return applications.stream()
                .map(LoanApplicationMapper::mapToLoanApplicationResponse)
                .collect(Collectors.toList());
    }

    // Modify this method to return LoanApplicationResponse instead of LoanApplication
    public List<LoanApplicationResponse> getLoanApplicationsByStatus(String status) {
        List<LoanApplication> applications = loanRepo.findByStatus(status);

        // Map LoanApplication entities to LoanApplicationResponse DTOs
        return applications.stream()
                .map(LoanApplicationMapper::mapToLoanApplicationResponse)
                .collect(Collectors.toList());
    }

    public LoanApplicationResponse getLoanById(Long id) {
        LoanApplication loan = loanRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found with ID: " + id));

        // Get currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        // Check if user has role ADMIN or LOAN_OFFICER
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        boolean isLoanOfficer = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_LOAN_OFFICER"));

        //if (isLoanOfficer){
        //    throw new AccessDeniedException("You are not authorized to access this loan, because you are the loan officer");
        //}
        //if (isAdmin){
        //    throw new AccessDeniedException("You are not authorized to access this loan, because you are the Admin");
        //}
        // Allow access if the user is the loan applicant or has elevated role
        if (!isAdmin && !isLoanOfficer) {
            if (!loan.getApplicant().getUsername().equals(currentUsername)) {
                throw new AccessDeniedException("You are not authorized to access this loan");
            }
        }

        return LoanApplicationMapper.mapToLoanApplicationResponse(loan);
    }



    // Load-Based Assignment to Loan Officer
    // Method to assign a loan officer dynamically using round-robin based on role_id
    @Transactional
    private void assignLoanOfficer(LoanApplication loanApplication) {
        // Define the roleId for "LOAN_OFFICER" (assuming roleId for LOAN_OFFICER is 2)
        List<User> loanOfficers = userRepo.findByRoles_Id(Long.valueOf(2));


        if (loanOfficers.isEmpty()) {
            throw new RuntimeException("No Loan Officers available.");
        }
        // Find the last loan application and its assigned officer
        LoanApplication lastLoanApplication = loanRepo.findTopByOrderByIdDesc(); // Get the most recent loan application

        User lastAssignedOfficer = lastLoanApplication != null ? lastLoanApplication.getLoanOfficer() : null;

        // If no loan officer has been assigned yet (e.g., first loan application), assign the first officer
        int lastAssignedIndex = -1;
        if (lastAssignedOfficer != null) {
            // Get the index of the last assigned officer
            lastAssignedIndex = loanOfficers.indexOf(lastAssignedOfficer);
        }

        // Calculate the next officer in the round-robin assignment
        int nextOfficerIndex = (lastAssignedIndex + 1) % loanOfficers.size();
        User nextAssignedOfficer = loanOfficers.get(nextOfficerIndex);

        // Assign the selected loan officer to the current loan application
        loanApplication.setLoanOfficer(nextAssignedOfficer);
    }

    // Loan Officer Decision
    @Transactional
    public LoanApplication processLoanDecision(Long applicationId, String status, String remarks) {
        LoanApplication application = loanRepo.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status);
        application.setRemarks(remarks);

        // Get the current date and time including fractional seconds
        LocalDateTime currentDateTime = LocalDateTime.now(); // This will provide both date and time with full precision

        // Set the last updated date (which will now include time and fractional seconds)
        application.setLastUpdatedDate(currentDateTime);

        return loanRepo.save(application); // Save the updated loan application to the database
    }

    // Manager Final Decision
    @Transactional
    public LoanApplication finalDecisionByManager(Long applicationId, String status, String remarks) {
        LoanApplication application = loanRepo.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!"APPROVED".equalsIgnoreCase(status) && !"REJECTED".equalsIgnoreCase(status)) {
            throw new RuntimeException("Invalid final decision.");
        }

        application.setStatus(status);
        application.setRemarks(remarks);
        return loanRepo.save(application);
    }
}
