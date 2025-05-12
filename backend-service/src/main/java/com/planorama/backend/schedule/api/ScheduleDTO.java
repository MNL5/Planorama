package com.planorama.backend.schedule.api;

import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record ScheduleDTO(@NotNull UUID id,
                          @NotNull String eventId,
                          @NotNull List<TimeSlotDTO> schedule) {
}