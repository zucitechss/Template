package org.example.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.example.dto.*;
import org.example.entity.LoanApplication;
import org.example.service.LoanApplicationMapper;
import org.example.service.LoanApplicationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.example.utilities.TokenUtil;

@RestController
@RequestMapping("/api/loans")
public class LoanApplicationController {

    private final LoanApplicationService loanService;

    @Autowired
    public LoanApplicationController(LoanApplicationService loanService) {
        this.loanService = loanService;
    }

    // Apply for Loan
    @PostMapping(value = "/apply", consumes = "multipart/form-data")
    @CrossOrigin(origins = "http://localhost:3000")
    public LoanApplication applyForLoan(
            @RequestParam("loanRequest") String loanRequestJson,
            @RequestParam("idProof") MultipartFile idProof,
            @RequestParam("incomeProof") MultipartFile incomeProof,
            @RequestParam("addressProof") MultipartFile addressProof,
            @RequestParam("photo") MultipartFile photo,
            Principal principal) {
        System.out.println("Received loanRequest JSON: " + loanRequestJson);
        try {
            //  Register JavaTimeModule to handle LocalDate and other Java 8 date/time classes
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

            //  Deserialize the loan request JSON
            LoanApplicationRequest request = objectMapper.readValue(loanRequestJson, LoanApplicationRequest.class);

            //  Attach document data
            DocumentInfoDTO docDto = new DocumentInfoDTO();
            docDto.setIdProof(idProof.getBytes());
            docDto.setIncomeProof(incomeProof.getBytes());
            docDto.setAddressProof(addressProof.getBytes());
            docDto.setPhoto(photo.getBytes());

            request.setDocumentInfo(docDto);

            //  Submit application using the authenticated user's name
            String username = principal.getName();
            return loanService.applyForLoan(request, username);
        } catch (Exception e) {
            e.printStackTrace(); // Print full stacktrace for debugging
            throw new RuntimeException("Error processing loan application", e);
        }
    }



    // Dynamic Loan Assignment
    //@PutMapping("/assign/{applicationId}")
    //public LoanApplication assignLoan(@PathVariable Long applicationId) {
     //   return loanService.assignLoanDynamically(applicationId);
    //}

    // Loan Officer Decision
    @PutMapping("/officer-decision")
    @ResponseBody
    public LoanDecisionResponse officerDecision(@RequestBody LoanDecisionRequest request) {
        LoanApplication loanApplication = loanService.processLoanDecision(request.getApplicationId(), request.getStatus(), request.getRemarks());

        boolean confirmationStatus = loanApplication != null;
        String message = confirmationStatus ?
                "Loan " + loanApplication.getId() + " has been successfully marked as " + loanApplication.getStatus() :
                "Failed to update the loan status";

        return new LoanDecisionResponse(confirmationStatus, message);
    }


    // Manager Final Decision
    @PutMapping("/manager-decision")
    public LoanApplication managerFinalDecision(@RequestBody LoanDecisionRequest request) {
        return loanService.finalDecisionByManager(request.getApplicationId(), request.getStatus(), request.getRemarks());
    }

    private static final Logger logger = LoggerFactory.getLogger(LoanApplicationController.class);

    // Fetch all loan applications
    @GetMapping("/loanapplications")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<LoanApplicationResponse> getAllLoanApplications() {
        return loanService.getAllLoanApplications();
    }

    // Allow access to LOAN_OFFICER or ADMIN
    @GetMapping("/secure/{loanIdToken}")
    @PreAuthorize("hasAnyRole('LOAN_OFFICER', 'ADMIN')")
    public ResponseEntity<LoanApplicationResponse> getLoanByIdToken(@PathVariable String loanIdToken) {
        Long loanId;

        try {
            loanId = TokenUtil.decodeLoanIdToken(loanIdToken);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();  // or a custom error response
        }

        LoanApplicationResponse response = loanService.getLoanById(loanId);
        return ResponseEntity.ok(response);
    }



    // Fetch loan applications by status
    @GetMapping("/status/{status}")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<LoanApplicationResponse> getLoanApplicationsByStatus(@PathVariable String status) {
        return loanService.getLoanApplicationsByStatus(status);
    }
}
