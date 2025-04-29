package com.planorama.backend.guest.api;

import jakarta.annotation.Nullable;

import java.util.Set;

public record UpdateGuestDTO(@Nullable String name,
                             @Nullable String phoneNumber,
                             @Nullable String gender,
                             @Nullable String group,
                             @Nullable RSVPStatusDTO status,
                             @Nullable Set<MealDTO> meal,
                             @Nullable String tableId) {
}