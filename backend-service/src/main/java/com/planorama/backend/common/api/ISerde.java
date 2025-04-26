package com.planorama.backend.common.api;

public interface ISerde {
    <T> String toJson(T entity);

    <T> T fromJson(String json, Class<T> classType);
}