package com.planorama.backend.gift.api;

import java.util.UUID;

public record GiftDTO(UUID id,
                      String eventId,
                      String guestId,
                      Double amount,
                      String greeting) {
}