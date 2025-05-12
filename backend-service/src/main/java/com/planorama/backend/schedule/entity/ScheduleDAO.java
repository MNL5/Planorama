package com.planorama.backend.schedule.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.UUID;

@Document("schedules")
public record ScheduleDAO(@Id UUID id,
                          @Indexed String eventId,
                          List<TimeSlotDAO> schedule) {
    public static final String EVENT_FIELD = "eventId";
    public static final String SCHEDULE_FIELD = "schedule";

}
