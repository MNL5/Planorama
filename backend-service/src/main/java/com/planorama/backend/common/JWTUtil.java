package com.planorama.backend.common;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Component
public class JWTUtil {
    private final Algorithm algorithm;

    public JWTUtil(Algorithm algorithm) {
        this.algorithm = algorithm;
    }

    public String generateToken(UUID id, Duration expirationTime) {
        return JWT.create()
                .withSubject(id.toString())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expirationTime.toMillis()))
                .sign(algorithm);
    }

    public String verifyToken(String token) {
        return JWT.require(algorithm)
                .build()
                .verify(token)
                .getSubject();
    }

    public Instant getExpireTime(String token) {
        return JWT.decode(token).getExpiresAtAsInstant();
    }
}