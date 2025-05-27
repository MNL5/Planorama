package com.planorama.backend.event.api;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface EventAPI {
    EventDTO getEventByID(UUID eventId);

    List<EventDTO> getAllEvents(@NotNull @NotEmpty String userID);

    List<EventDTO> getEventBetweenDates(@NotNull OffsetDateTime from, @NotNull OffsetDateTime to);
}