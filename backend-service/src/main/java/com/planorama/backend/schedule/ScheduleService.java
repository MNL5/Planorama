package com.planorama.backend.schedule;

import com.mongodb.BasicDBObject;
import com.planorama.backend.schedule.api.CreateTimeSlotDTO;
import com.planorama.backend.schedule.api.UpdateTimeSlotDTO;
import com.planorama.backend.schedule.entity.ScheduleDAO;
import com.planorama.backend.schedule.entity.TimeSlotDAO;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Service
public class ScheduleService {
    private static final String INNER_TIME_SLOT = "schedule.$.";
    private final ReactiveMongoTemplate reactiveMongoTemplate;
    private final Map<String, Function<UpdateTimeSlotDTO, Object>> updateFields;

    public ScheduleService(ReactiveMongoTemplate reactiveMongoTemplate) {
        this.reactiveMongoTemplate = reactiveMongoTemplate;
        this.updateFields = Map.of(
                INNER_TIME_SLOT + TimeSlotDAO.START_TIME_FIELD, u -> u.startTime() != null ? u.startTime().toInstant().toEpochMilli() : null,
                INNER_TIME_SLOT + TimeSlotDAO.END_TIME_FIELD, u -> u.endTime() != null ? u.endTime().toInstant().toEpochMilli() : null,
                INNER_TIME_SLOT + TimeSlotDAO.DESCRIPTION_FIELD, UpdateTimeSlotDTO::description
        );
    }

    public Mono<ScheduleDAO> getScheduleByEventId(String eventId) {
        return reactiveMongoTemplate.findOne(Query.query(Criteria.where(ScheduleDAO.EVENT_FIELD).is(eventId)), ScheduleDAO.class);
    }

    public Mono<ScheduleDAO> upsertSchedule(CreateTimeSlotDTO createTimeSlotDTO) {
        final TimeSlotDAO timeSlot = createTimeSlot(createTimeSlotDTO.startTime(), createTimeSlotDTO.endTime(), createTimeSlotDTO.description());

        return reactiveMongoTemplate.findOne(
                        Query.query(Criteria.where(ScheduleDAO.EVENT_FIELD).is(createTimeSlotDTO.eventId())),
                        ScheduleDAO.class)
                .flatMap(existing -> {
                    List<TimeSlotDAO> updatedSlots = new ArrayList<>(existing.schedule());
                    updatedSlots.add(timeSlot);
                    return reactiveMongoTemplate.save(new ScheduleDAO(
                            existing.id(),
                            existing.eventId(),
                            updatedSlots
                    ));
                })
                .switchIfEmpty(reactiveMongoTemplate.save(new ScheduleDAO(
                        UUID.randomUUID(),
                        createTimeSlotDTO.eventId(),
                        List.of(timeSlot)
                )));
    }

    private TimeSlotDAO createTimeSlot(OffsetDateTime startTime, OffsetDateTime endTime, String description) {
        return new TimeSlotDAO(UUID.randomUUID(), startTime.toInstant().toEpochMilli(), endTime.toInstant().toEpochMilli(), description);
    }

    public Mono<ScheduleDAO> updateTimeSlot(String eventId, UUID timeSlotId, UpdateTimeSlotDTO updateTimeSlotDTO) {
        return reactiveMongoTemplate.findAndModify(Query.query(Criteria.where(ScheduleDAO.EVENT_FIELD).is(eventId)
                        .and("schedule.id").is(timeSlotId)),
                createUpdateCommand(updateTimeSlotDTO),
                FindAndModifyOptions.options().returnNew(true),
                ScheduleDAO.class);
    }

    private Update createUpdateCommand(UpdateTimeSlotDTO updateTimeSlotDTO) {
        final Update update = new Update();

        updateFields.forEach((key, extractor) -> {
            Object value = extractor.apply(updateTimeSlotDTO);
            if (value != null) update.set(key, value);
        });
        return update;
    }

    public Mono<ScheduleDAO> deleteTimeSlot(String eventId, UUID timeSlotId) {
        return reactiveMongoTemplate.findAndModify(Query.query(Criteria.where(ScheduleDAO.EVENT_FIELD).is(eventId)),
                new Update().pull(ScheduleDAO.SCHEDULE_FIELD, new BasicDBObject(TimeSlotDAO.ID_FIELD, timeSlotId)),
                FindAndModifyOptions.options().returnNew(true),
                ScheduleDAO.class);
    }
}