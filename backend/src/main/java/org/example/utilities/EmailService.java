package org.example.utilities;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    // Send OTP email with HTML format
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true); // true for HTML content

            // Set the recipient and subject
            helper.setTo(toEmail);
            helper.setSubject("Password Reset OTP");

            // Create HTML content with the OTP value
            String htmlContent = String.format("""
                <body>
                    <div style="font-family: Arial, sans-serif; margin: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
                        <h3 style="color: #007bff;">Your OTP</h3>
                        <p>Hello,</p>
                        <p>Your one-time password (OTP) is:</p>
                        <div style="font-size: 1.5em; font-weight: bold; color: #28a745;">%s</div>
                        <p>Please use this OTP within the next 5 minutes.</p>
                        <p>Thank you!</p>
                    </div>
                </body>
                """, otp); // Replace %s with the OTP

            // Set the email content (HTML format)
            helper.setText(htmlContent, true);

            // Send the email
            mailSender.send(message);
            logger.info("OTP email successfully sent to: {}", toEmail);

        } catch (MessagingException e) {
            // Log the error and throw an exception
            logger.error("Error sending OTP email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage(), e);
        }
    }
}
