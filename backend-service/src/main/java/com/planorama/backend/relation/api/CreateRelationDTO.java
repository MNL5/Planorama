package com.planorama.backend.relation.api;

import jakarta.validation.constraints.NotEmpty;

public record CreateRelationDTO(@NotEmpty String eventId,
                                @NotEmpty String firstGuestId,
                                @NotEmpty String secondGuestId,
                                @NotEmpty RelationStatus relation) {
}