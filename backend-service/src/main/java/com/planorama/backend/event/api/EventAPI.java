package com.planorama.backend.event.api;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.OffsetDateTime;
import java.util.UUID;

public interface EventAPI {
    Mono<EventDTO> getEventByID(UUID eventId);

    Flux<EventDTO> getEventBetweenDates(OffsetDateTime from, OffsetDateTime to);
}