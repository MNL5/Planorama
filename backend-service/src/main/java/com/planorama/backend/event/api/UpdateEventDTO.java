package com.planorama.backend.event.api;

import jakarta.annotation.Nullable;

import java.time.OffsetDateTime;

public record UpdateEventDTO(@Nullable String name,
                             @Nullable String invitationText,
                             @Nullable String invitationImg,
                             @Nullable OffsetDateTime time,
                             @Nullable DiagramDTO diagram) {
}