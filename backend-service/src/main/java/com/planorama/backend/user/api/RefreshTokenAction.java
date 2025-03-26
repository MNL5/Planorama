package com.planorama.backend.user.api;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record RefreshTokenAction(@NotNull UUID userID, @NotNull UUID refreshToken) {
}