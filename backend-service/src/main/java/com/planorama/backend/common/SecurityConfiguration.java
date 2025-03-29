package com.planorama.backend.common;

import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Set;

@Configuration
public class SecurityConfiguration {
    @Bean
    public Algorithm algorithm(@Value("${TOKEN_SECRET:PlanoramaIsTheBest}") String secret) {
        return Algorithm.HMAC256(secret);
    }

    @Bean
    public Set<String> permitRoutes() {
        return Set.of("/users");
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll()) // Allow all requests
                .csrf(AbstractHttpConfigurer::disable)  // Disable CSRF (if needed)
                .formLogin(AbstractHttpConfigurer::disable)  // Disable form login
                .httpBasic(AbstractHttpConfigurer::disable); // Disable HTTP Basic auth

        return http.build();
    }
}