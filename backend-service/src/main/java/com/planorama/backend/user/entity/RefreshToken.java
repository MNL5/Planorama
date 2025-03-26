package com.planorama.backend.user.entity;

import java.util.UUID;

public record RefreshToken(UUID value, long expireTimeEpochMillis) {
}
