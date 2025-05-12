package com.planorama.backend.schedule.api;

import jakarta.annotation.Nullable;

import java.time.OffsetDateTime;

public record UpdateTimeSlotDTO(@Nullable OffsetDateTime startTime,
                                @Nullable OffsetDateTime endTime,
                                @Nullable String description) {
}