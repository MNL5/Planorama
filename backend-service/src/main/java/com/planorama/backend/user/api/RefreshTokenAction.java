package com.planorama.backend.user.api;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record RefreshTokenAction(@NotNull @NotEmpty String refreshToken) {
}