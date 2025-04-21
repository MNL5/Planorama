package com.planorama.backend.guest.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;
import java.util.UUID;

@Document("guests")
public record GuestDAO(@Id UUID id,
                       @Indexed String eventID,
                       String name,
                       String phoneNumber,
                       String gender,
                       String group,
                       String status,
                       Set<String> meal,
                       Integer table) {
    public static final String ID_FIELD = "id";
    public static final String EVENT_ID_FIELD = "eventID";
    public static final String NAME_FIELD = "name";
    public static final String PHONE_NUMBER_FIELD = "phoneNumber";
    public static final String GENDER_FIELD = "gender";
    public static final String GROUP_FIELD = "group";
    public static final String STATUS_FIELD = "status";
    public static final String MEAL_FIELD = "meal";
    public static final String TABLE_FIELD = "table";
}