package com.example.fittracker.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@ControllerAdvice
public class ApiExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler({
        HttpMessageNotReadableException.class,
        IllegalArgumentException.class,
        MethodArgumentTypeMismatchException.class,
        MethodArgumentNotValidException.class,
    })
    public ResponseEntity<Map<String, String>> badRequest(Exception e) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(Map.of("error", "bad_request", "message", String.valueOf(e.getMessage())));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> serverError(Exception e) throws Exception {
        // Let Spring's own ErrorResponseException / ResponseStatusException flow through
        // with their intended status codes (e.g. NoResourceFoundException → 404).
        if (e instanceof ErrorResponseException || e instanceof ResponseStatusException) {
            throw e;
        }
        log.error("Unhandled server error", e);
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of("error", "internal_error"));
    }
}
