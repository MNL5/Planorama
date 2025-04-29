package com.planorama.backend.guest.api;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

public record CreateGuestDTO(@NotEmpty String eventId,
                             @NotEmpty String name,
                             @NotEmpty String phoneNumber,
                             @Nullable String gender,
                             @Nullable String group,
                             @Nullable RSVPStatusDTO status,
                             @Nullable Set<MealDTO> meal,
                             @Nullable String tableId) {
}