package com.planorama.backend.user.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Component
public class JWTUtil {
    private final Duration expirationTime;
    private final Algorithm algorithm;

    public JWTUtil(Algorithm algorithm, @Qualifier("expireTime") Duration expirationTime) {
        this.algorithm = algorithm;
        this.expirationTime = expirationTime;
    }

    public String generateToken(UUID id) {
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