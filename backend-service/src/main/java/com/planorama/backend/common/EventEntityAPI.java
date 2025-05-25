package com.planorama.backend.common;

import java.util.UUID;

public interface EventEntityAPI<T extends EventEntity> {
    T findById(UUID id);
}