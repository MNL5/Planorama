package com.planorama.backend.schedule.api;

import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

public record CreateTimeSlotDTO(@NotNull String eventId,
                                @NotNull OffsetDateTime startTime,
                                @NotNull OffsetDateTime endTime,
                                @NotNull String description) {
}