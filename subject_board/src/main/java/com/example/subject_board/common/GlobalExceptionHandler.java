package com.example.subject_board.common;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiError(e.getMessage()));
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ApiError> handleSecurity(SecurityException e) {
        String msg = e.getMessage();

        if ("unauthorized".equals(msg)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiError("unauthorized"));
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ApiError("forbidden"));
    }
}
