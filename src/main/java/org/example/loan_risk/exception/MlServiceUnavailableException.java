package org.example.loan_risk.exception;

public class MlServiceUnavailableException extends RuntimeException {
    public MlServiceUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
