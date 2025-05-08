package com.planorama.backend.gift.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document("gifts")
@CompoundIndex(name = "unique_event_guest", def = "{'eventId': 1, 'guestId': 1}", unique = true)
public record GiftDAO(@Id UUID id,
                      String eventId,
                      String guestId,
                      Double amount,
                      String greeting
) {
    public static final String ID_FIELD = "id";
    public static final String EVENT_FIELD = "eventId";
    public static final String GREETING_FIELD = "greeting";
    public static final String AMOUNT_FIELD = "amount";
}