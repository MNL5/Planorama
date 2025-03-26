package com.planorama.backend.user.entity;

public record UserAccess(UserDAO userDAO, String accessToken, RefreshToken refreshToken) {
}
