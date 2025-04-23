package com.planorama.backend.relation.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record UpdateRelationDTO(@NotNull @Valid RelationStatus relation) {
}
