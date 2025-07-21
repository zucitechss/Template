package org.example.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message, String email) {
        super(message + ": " + email); // Concatenate the email to the message
    }
}
