package com.planorama.backend.common;

import com.fasterxml.jackson.annotation.JsonIgnore;

public interface EventEntity {
    @JsonIgnore
    String getEventId();
}