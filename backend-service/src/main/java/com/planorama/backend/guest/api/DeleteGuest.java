package com.planorama.backend.guest.api;

import java.util.Objects;

public record DeleteGuest(String guestId) {
    public DeleteGuest(String guestId) {
        this.guestId = Objects.requireNonNull(guestId);
    }
}