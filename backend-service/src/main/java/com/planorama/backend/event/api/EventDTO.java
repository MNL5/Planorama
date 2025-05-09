package com.planorama.backend.event.api;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.UUID;

public record EventDTO(@NotNull UUID id,
                       @NotNull String name,
                       @NotNull String invitationText,
                       @NotNull String invitationImg,
                       @NotNull OffsetDateTime time,
                       @Nullable DiagramDTO diagram) {
}