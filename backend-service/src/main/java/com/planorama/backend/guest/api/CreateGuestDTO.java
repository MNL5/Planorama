package com.planorama.backend.guest.api;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotEmpty;

public record CreateGuestDTO(@NotEmpty String eventId,
                             @NotEmpty String name,
                             @NotEmpty String phoneNumber,
                             @Nullable String gender,
                             @Nullable String group) {
}