package com.planorama.backend.relation.entity;

import com.planorama.backend.relation.api.RelationStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document("relations")
public record RelationDAO(@Id UUID id,
                          String eventId,
                          @Indexed(unique = true) String guestsNormalize,
                          String firstGuestId,
                          String secondGuestId,
                          RelationStatus relation) {
    public static final String ID_FIELD = "id";
    public static final String EVENT_ID_FIELD = "eventId";
    public static final String FIRST_GUEST_ID_FIELD = "firstGuestId";
    public static final String SECOND_GUEST_ID_FIELD = "secondGuestId";
    public static final String RELATION_FIELD = "relation";
}