package com.planorama.backend.task.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document("tasks")
public record TaskDAO(
        @Id UUID id,
        @Indexed String eventId,
        String description,
        Boolean fulfilled) {
    public static final String ID_FIELD = "_id";
    public static final String EVENT_ID_FIELD = "eventId";
    public static final String DESCRIPTION_FIELD = "description";
    public static final String FULFILLED_FIELD = "fulfilled";
}