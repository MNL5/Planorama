package com.planorama.backend.event.entity;

import org.bson.types.Binary;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document("events")
public record EventDAO(@Id UUID id,
                       String name,
                       String invitationText,
                       Binary invitationImg,
                       Long time,
                       String diagram) {
}
