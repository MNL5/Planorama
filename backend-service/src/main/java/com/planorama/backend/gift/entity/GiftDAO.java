package com.planorama.backend.gift.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document("gifts")
public record GiftDAO(@Id UUID id,
                      @Indexed String eventId,
                      String guestId,
                      Double amount,
                      String greeting
) {
    public static final String ID_FIELD = "id";
    public static final String EVENT_FIELD = "eventId";
    public static final String GREETING_FIELD = "greeting";
    public static final String AMOUNT_FIELD = "amount";
}