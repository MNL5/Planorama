package com.planorama.backend.common;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.planorama.backend.common.api.ISerde;
import org.springframework.stereotype.Component;

@Component
public class JacksonSerde implements ISerde {
    private final ObjectMapper mapper;

    public JacksonSerde(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public <T> String toJson(T entity) {
        try {
            return mapper.writeValueAsString(entity);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public <T> T fromJson(String json, Class<T> classType) {
        return null;
    }
}
