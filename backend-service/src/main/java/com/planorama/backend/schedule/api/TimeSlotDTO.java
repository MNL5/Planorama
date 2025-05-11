package com.planorama.backend.schedule.api;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.UUID;

public record TimeSlotDTO(@NotNull UUID id,
                          @NotNull OffsetDateTime startTime,
                          @NotNull OffsetDateTime endTime,
                          @NotEmpty String description) {
}
