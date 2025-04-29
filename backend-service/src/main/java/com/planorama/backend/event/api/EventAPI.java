package com.planorama.backend.event.api;

import reactor.core.publisher.Mono;

import java.util.UUID;

public interface EventAPI {
    Mono<EventDTO> getEventByID(UUID eventId);
}