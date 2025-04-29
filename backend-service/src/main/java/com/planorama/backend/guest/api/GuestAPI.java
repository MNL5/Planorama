package com.planorama.backend.guest.api;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface GuestAPI {
    Mono<GuestDTO> getGuest(UUID guestId);

    Flux<GuestDTO> getAllGuestByEventID(String eventId);
}