package org.example.exception;

// IncorrectPasswordException.java
public class IncorrectPasswordException extends RuntimeException {
    public IncorrectPasswordException(String message) {
        super(message);
    }
}
