package com.planorama.backend.relation.api;

import com.planorama.backend.common.EventEntity;

import java.util.UUID;

public record RelationDTO(UUID id,
                          String eventId,
                          String firstGuestId,
                          String secondGuestId,
                          RelationStatus relation) implements EventEntity {
    @Override
    public String getEventId() {
        return eventId;
    }
}