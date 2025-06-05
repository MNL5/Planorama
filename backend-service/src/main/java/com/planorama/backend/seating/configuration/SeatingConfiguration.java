package com.planorama.backend.seating.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class SeatingConfiguration {

    @Bean("algoServiceClient")
    public WebClient algoServiceClient(@Value("${ALGO_SERVICE_URL:http://localhost:5000}") String algoServiceURL) {
        return WebClient.builder().baseUrl(algoServiceURL).build();
    }
}