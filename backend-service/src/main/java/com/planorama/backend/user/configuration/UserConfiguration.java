package com.planorama.backend.user.configuration;

import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.time.Duration;

@Configuration
public class UserConfiguration {
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean("refreshExpireTime")
    public Duration refreshExpireTime(@Value("${REFRESH_TOKEN_EXPIRE_TIME:PT1H}") String refreshTokenExpireTime) {
        return Duration.parse(refreshTokenExpireTime);
    }

    @Bean("expireTime")
    public Duration expireTime(@Value("${TOKEN_EXPIRE_TIME:PT1H}") String tokenExpireTime) {
        return Duration.parse(tokenExpireTime);
    }

    @Bean
    public Algorithm algorithm(@Value("${TOKEN_SECRET:PlanoramaIsTheBest}") String secret) {
        return Algorithm.HMAC256(secret);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()  // Allow all requests
                )
                .csrf(AbstractHttpConfigurer::disable)  // Disable CSRF if not needed
                .build();
    }
}