package com.planorama.backend.common;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Allows all endpoints
                        .allowedOriginPatterns("*") // Allows all origins
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allows all standard methods
                        .allowedHeaders("*") // Allows all headers
                        .allowCredentials(true);
            }
        };
    }
}