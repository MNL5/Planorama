package com.planorama.backend.event.entity;

import org.bson.types.Binary;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Document("events")
public record EventDAO(@Id UUID id,
                       @Indexed String ownerID,
                       String name,
                       String invitationText,
                       Binary invitationImg,
                       Long time,
                       String diagram) {
    public static final String ID_FIELD = "id";
    public static final String OWNER_ID_FIELD = "ownerID";
    public static final String NAME_FIELD = "name";
    public static final String INVITATION_TEXT_FIELD = "invitationText";
    public static final String INVITATION_IMAGE_FIELD = "invitationImg";
    public static final String TIME_FIELD = "time";
    public static final String DIAGRAM_FIELD = "diagram";
}
