package com.planorama.backend.guest.api;

import jakarta.annotation.Nullable;

import java.util.Set;

public record UpdateRsvpGuestDTO(@Nullable RSVPStatusDTO status,
                                 @Nullable Set<MealDTO> meal) {
}