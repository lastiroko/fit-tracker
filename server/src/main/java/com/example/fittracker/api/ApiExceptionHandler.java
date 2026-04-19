package com.example.fittracker.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Map;

/**
 * Extends ResponseEntityExceptionHandler so Spring's built-in handlers keep mapping MVC
 * exceptions (NoResourceFoundException → 404, malformed JSON → 400, etc.) to their proper
 * HTTP status codes. We only add a narrow handler for IllegalArgumentException and a
 * last-resort handler for truly unexpected RuntimeExceptions.
 */
@ControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> badArgs(IllegalArgumentException e) {
        return ResponseEntity
            .badRequest()
            .body(Map.of("error", "bad_request", "message", String.valueOf(e.getMessage())));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> unhandled(RuntimeException e) {
        log.error("Unhandled runtime error", e);
        return ResponseEntity
            .internalServerError()
            .body(Map.of("error", "internal_error"));
    }
}
