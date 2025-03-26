package com.planorama.backend.user.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Date;

@Component
public class JWTUtil {
    private final Duration expirationTime;
    private final Algorithm algorithm;

    public JWTUtil(Algorithm algorithm, @Qualifier("expireTime") Duration expirationTime) {
        this.algorithm = algorithm;
        this.expirationTime = expirationTime;
    }

    public String generateToken(String email) {
        return JWT.create()
                .withSubject(email)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expirationTime.toMillis())) // Expiry time
                .sign(algorithm);
    }
}