package com.planorama.backend.user.api;

import java.util.UUID;

public record LoginUserDTO(UUID id, String accessToken, String refreshToken) {
}