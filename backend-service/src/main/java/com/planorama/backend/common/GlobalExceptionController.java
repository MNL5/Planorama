package com.planorama.backend.common;

import com.planorama.backend.common.exceptions.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionController {
    @ExceptionHandler({RuntimeException.class, EntityNotFoundException.class})
    public final ResponseEntity<String> handleException(RuntimeException error) {
        return ResponseEntity.internalServerError().body(error.getMessage());
    }
}