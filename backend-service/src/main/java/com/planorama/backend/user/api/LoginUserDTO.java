package com.planorama.backend.user.api;

import java.util.UUID;

public record LoginUserDTO(UUID uuid, String email, String accessToken, UUID refreshToken) {
}