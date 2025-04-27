package com.planorama.backend.event.api;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.UUID;

public record EventDTO(@NotNull UUID id,
                       @Nullable String name,
                       @Nullable String invitationText,
                       @Nullable String invitationImg,
                       @Nullable OffsetDateTime time,
                       @Nullable DiagramDTO diagram) {
}