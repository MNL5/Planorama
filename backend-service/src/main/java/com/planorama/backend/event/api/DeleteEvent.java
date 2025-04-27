package com.planorama.backend.event.api;

import org.springframework.context.ApplicationEvent;

import java.util.Objects;

public class DeleteEvent extends ApplicationEvent {
    private final String eventId;

    public DeleteEvent(Object source, String eventId) {
        super(source);
        this.eventId = Objects.requireNonNull(eventId);
    }

    public String getEventId() {
        return eventId;
    }
}