package com.planorama.backend.user.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

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
}