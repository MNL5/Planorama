package com.planorama.backend.guest.api;

import org.springframework.context.ApplicationEvent;

import java.util.Objects;

public class DeleteGuest extends ApplicationEvent {
    private final String guestId;

    public DeleteGuest(Object source, String guestId) {
        super(source);
        this.guestId = Objects.requireNonNull(guestId);
    }

    public String getGuestId() {
        return guestId;
    }
}