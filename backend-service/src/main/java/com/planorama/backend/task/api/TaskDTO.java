package com.planorama.backend.task.api;

import com.planorama.backend.common.EventEntity;

import java.util.UUID;

public record TaskDTO(UUID id,
                      String eventId,
                      String description,
                      Boolean fulfilled) implements EventEntity {
    @Override
    public String getEventId() {
        return eventId;
    }
}