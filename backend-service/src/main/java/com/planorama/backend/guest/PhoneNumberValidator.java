package com.planorama.backend.guest;

import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.regex.Pattern;

@Component
public class PhoneNumberValidator {
    private static final Pattern PHONE_FORMAT_PATTERN = Pattern.compile(
            "^(?:\\(?\\+972\\)?|0)[\\s-]?(?:\\(?5\\d\\)?)[\\s-]?\\d{3}[\\s-]?\\d{4}$");

    public Optional<String> normalize(String input) {
        if (input == null || input.isBlank()) {
            return Optional.empty();
        }

        if (!PHONE_FORMAT_PATTERN.matcher(input).matches()) {
            return Optional.empty();
        }

        final String digits = input.replaceAll("\\D", "");

        if (digits.startsWith("972") && digits.length() == 12) {
            return Optional.of("+972" + digits.substring(3));
        }

        if (digits.startsWith("05") && digits.length() == 10) {
            return Optional.of("+972" + digits.substring(1));
        }

        return Optional.empty();
    }
}