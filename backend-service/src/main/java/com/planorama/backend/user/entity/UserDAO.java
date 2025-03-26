package com.planorama.backend.user.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;
import java.util.UUID;

@Document("users")
public record UserDAO(@Id UUID id, @Indexed(unique = true) String email, String password, Set<String> refreshTokens) {
}