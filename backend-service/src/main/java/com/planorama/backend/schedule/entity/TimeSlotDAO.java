package com.planorama.backend.schedule.entity;

import java.util.UUID;

public record TimeSlotDAO(UUID id,
                          Long startTime,
                          Long endTime,
                          String description) {
    public static final String ID_FIELD = "id";
    public static final String START_TIME_FIELD = "startTime";
    public static final String END_TIME_FIELD = "endTime";
    public static final String DESCRIPTION_FIELD = "description";
}