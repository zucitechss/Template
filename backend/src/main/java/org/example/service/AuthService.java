package org.example.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import org.example.dto.ForgotPasswordRequest;
import org.example.dto.LoginRequest;
import org.example.dto.RegisterRequest;
import org.example.dto.ResetPasswordRequest;
import org.example.entity.Otp;
import org.example.entity.Role;
import org.example.entity.RoleName;
import org.example.entity.User;
import org.example.exception.IncorrectPasswordException;
import org.example.exception.InvalidOtpException;
import org.example.exception.UserNotFoundException;
import org.example.jwttoken.JwtUtil;
import org.example.repository.OtpRepository;
import org.example.repository.RoleRepository;
import org.example.repository.UserRepository;
import org.example.utilities.EmailService;
import org.example.utilities.OtpGenerator;
import org.example.utilities.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import session_management.SessionService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private final SessionService sessionService; // Inject SessionService

    @Autowired
    private RoleRepository roleRepository;  // Inject RoleRepository

    @Autowired
    private JwtUtil jwtUtil;

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    public AuthService(UserRepository userRepository, OtpRepository otpRepository, EmailService emailService, SessionService sessionService) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.emailService = emailService;
        this.sessionService = sessionService;
    }

    public void registerUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(PasswordUtil.hashPassword(request.getPassword())); // Hash the password

        // Fetch the role using the role name
        Role defaultRole = roleRepository.findByRoleName(RoleName.APPLICANT)
                .orElseThrow(() -> new IllegalArgumentException("Role APPLICANT not found"));

        user.getRoles().add(defaultRole);


        user.setActive(true); // Set active by default
        userRepository.save(user);
    }

    public Map<String, String> loginUser(LoginRequest request) {
        // Check if the user exists
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email", request.getEmail()));

        // Validate password
        if (!PasswordUtil.checkPassword(request.getPassword(), user.getPassword())) {
            throw new IncorrectPasswordException("Incorrect password for email: " + request.getEmail());
        }

        // Extract role (assume getRole() returns something like "ROLE_ADMIN")
        Set<String> roles = user.getRoles().stream()
                .map(r -> r.getRoleName().name())
                .collect(Collectors.toSet());

        Set<String> rolePermissions = user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(permission -> permission.getName().name())
                .collect(Collectors.toSet());

        Set<String> directPermissions = user.getPermissions().stream()
                .map(permission -> permission.getName().name())
                .collect(Collectors.toSet());

        Set<String> allPermissions = new HashSet<>();
        allPermissions.addAll(rolePermissions);
        allPermissions.addAll(directPermissions);


        String token = jwtUtil.generateToken(user.getEmail(), roles, allPermissions);
        String sessionId = sessionService.createSession(request.getEmail(), 1800);
        logger.info("Session created for user: {} with session ID: {}", request.getEmail(), sessionId);

        ObjectMapper objectMapper = new ObjectMapper();

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        try {
            response.put("role", objectMapper.writeValueAsString(roles));
            response.put("permissions", objectMapper.writeValueAsString(allPermissions));
        } catch (Exception e) {
            throw new RuntimeException("Error serializing roles/permissions", e);
        }

        return response;
    }



    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        try {
            // Log request data for debugging
            logger.info("Received forgot password request for email: {}", request.getEmail());

            // Check if user exists
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
            if (!userOpt.isPresent()) {
                throw new UserNotFoundException("User not found with email: {}", request.getEmail());
            }

            // Generate OTP and set expiry time
            String otp = OtpGenerator.generateOtp();
            logger.info("Generated OTP: {}", otp);

            LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);
            logger.info("OTP will expire at: {}", expiryTime);

            // Create OTP entity
            Otp otpEntity = new Otp();
            otpEntity.setEmail(request.getEmail());
            otpEntity.setOtp(otp);
            otpEntity.setExpiryTime(expiryTime);

            // Delete any existing OTP for the email to ensure there are no duplicates
            try {
                otpRepository.deleteByEmail(request.getEmail());
                logger.info("Existing OTP records deleted for email: {}", request.getEmail());
            } catch (Exception e) {
                logger.error("Failed to delete existing OTP for email: {}", request.getEmail(), e);
            }

            // Save the new OTP
            otpRepository.save(otpEntity);
            logger.info("New OTP saved to database for email: {}", request.getEmail());

            // Send OTP email
            emailService.sendOtpEmail(request.getEmail(), otp);
            logger.info("OTP email sent to: {}", request.getEmail());

        } catch (UserNotFoundException e) {
            logger.error("User not found: {}", request.getEmail(), e);
            throw e;  // Rethrow to handle in GlobalExceptionHandler
        } catch (Exception e) {
            logger.error("Error processing forgot password request for email: {}", request.getEmail(), e);
            throw new RuntimeException("Failed to process forgot password request: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        // Find OTP by email
        Otp otp = otpRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidOtpException("OTP not found or expired"));

        // Validate OTP
        if (!otp.getOtp().equals(request.getOtp())) {
            throw new InvalidOtpException("Invalid OTP");
        }
        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new InvalidOtpException("Expired OTP");
        }

        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found with email", request.getEmail()));

        // Hash the new password and update the user
        user.setPassword(PasswordUtil.hashPassword(request.getNewPassword()));
        userRepository.save(user); // Save updated user to the database

        // Delete OTP after successful password reset
        otpRepository.deleteByEmail(request.getEmail());
    }

    // Logout user and invalidate session
    public void logoutUser(String sessionId) {
        // Invalidate the session on logout
        sessionService.invalidateSession(sessionId);
        logger.info("Session invalidated for session ID: {}", sessionId);
    }
}
