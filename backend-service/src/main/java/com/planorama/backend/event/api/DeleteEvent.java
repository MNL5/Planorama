package com.planorama.backend.event.api;

import java.util.Objects;

public record DeleteEvent(String eventId) {
    public DeleteEvent(String eventId) {
        this.eventId = Objects.requireNonNull(eventId);
    }
}