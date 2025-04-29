package com.planorama.backend.guest.api;

import java.util.Set;
import java.util.UUID;

public record GuestDTO(UUID id,
                       String eventID,
                       String name,
                       String phoneNumber,
                       String gender,
                       String group,
                       RSVPStatusDTO status,
                       Set<MealDTO> meal,
                       String tableId) {
}