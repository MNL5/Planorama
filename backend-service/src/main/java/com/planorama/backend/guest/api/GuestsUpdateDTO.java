package com.planorama.backend.guest.api;

import jakarta.validation.constraints.NotEmpty;

import java.util.Map;
import java.util.UUID;

public record GuestsUpdateDTO(@NotEmpty String eventId, @NotEmpty Map<UUID, UpdateGuestDTO> guests) {
}