package com.planorama.backend.event.api;

import jakarta.validation.constraints.NotNull;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.OffsetDateTime;
import java.util.UUID;

public interface EventAPI {
    Mono<EventDTO> getEventByID(UUID eventId);

    Flux<EventDTO> getEventBetweenDates(@NotNull OffsetDateTime from, @NotNull OffsetDateTime to);
}