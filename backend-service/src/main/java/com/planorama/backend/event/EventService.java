package com.planorama.backend.event;

import com.planorama.backend.event.api.CreateEventDTO;
import com.planorama.backend.event.api.UpdateEventDTO;
import com.planorama.backend.event.entity.EventDAO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.bson.BsonBinarySubType;
import org.bson.types.Binary;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class EventService {
    private final ReactiveMongoTemplate reactiveMongoTemplate;
    private final Map<String, Function<UpdateEventDTO, Object>> updateFields;


    public EventService(ReactiveMongoTemplate reactiveMongoTemplate) {
        this.reactiveMongoTemplate = reactiveMongoTemplate;
        this.updateFields = Map.of(
                "name", UpdateEventDTO::name,
                "invitationText", UpdateEventDTO::invitationText,
                "invitationImg", u -> u.invitationImg() != null ? new Binary(BsonBinarySubType.BINARY, u.invitationImg().getBytes()) : null,
                "time", u -> u.time() != null ? u.time().toInstant().toEpochMilli() : null,
                "diagram", UpdateEventDTO::diagram
        );
    }

    public Mono<EventDAO> findByID(UUID eventUUID) {
        return reactiveMongoTemplate.findById(eventUUID, EventDAO.class);
    }

    public Flux<EventDAO> findAll() {
        return reactiveMongoTemplate.findAll(EventDAO.class);
    }

    public Mono<EventDAO> createEvent(@Valid @NotNull CreateEventDTO createEventDTO) {
        return Mono.just(createEventDTO)
                .map(this::createEventDAO)
                .flatMap(reactiveMongoTemplate::save)
                .switchIfEmpty(Mono.error(new RuntimeException("Failed to create an event")));
    }

    private EventDAO createEventDAO(CreateEventDTO createEventDTO) {
        return new EventDAO(UUID.randomUUID(),
                createEventDTO.name(),
                createEventDTO.invitationText(),
                new Binary(BsonBinarySubType.BINARY, createEventDTO.invitationImg().getBytes()),
                createEventDTO.time().toEpochSecond() * 1000,
                null);
    }

    public Mono<EventDAO> updateEvent(@Valid @NotNull UUID eventUUID, @Valid @NotNull UpdateEventDTO updateEventDTO) {
        return Mono.just(updateEventDTO)
                .map(this::createUpdateCommand)
                .flatMap(updateCommand -> reactiveMongoTemplate.findAndModify(Query.query(where("uuid").is(eventUUID)),
                        updateCommand,
                        EventDAO.class));
    }

    private Update createUpdateCommand(UpdateEventDTO updateEventDTO) {
        final Update update = new Update();

        updateFields.forEach((key, extractor) -> {
            Object value = extractor.apply(updateEventDTO);
            if (value != null) update.set(key, value);
        });
        return update;
    }

    public Mono<EventDAO> deleteEvent(@Valid @NotNull UUID eventUUID) {
        return reactiveMongoTemplate.findAndRemove(Query.query(where("uuid").is(eventUUID)), EventDAO.class);
    }
}