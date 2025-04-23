package com.planorama.backend.relation.api;

import java.util.UUID;

public record RelationDTO(UUID id,
                          String eventId,
                          String firstGuestId,
                          String secondGuestId,
                          RelationStatus relation) {
}