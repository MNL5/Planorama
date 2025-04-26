package com.planorama.backend.event;

import com.planorama.backend.event.api.CreateEventDTO;
import com.planorama.backend.event.api.UpdateEventDTO;
import com.planorama.backend.event.entity.EventDAO;
import com.planorama.backend.guest.api.GuestAPI;
import com.planorama.backend.guest.api.GuestDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
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
    private final GuestAPI guestAPI;
    private final Map<String, Function<UpdateEventDTO, Object>> updateFields;


    public EventService(ReactiveMongoTemplate reactiveMongoTemplate,
                        GuestAPI guestAPI) {
        this.reactiveMongoTemplate = reactiveMongoTemplate;
        this.guestAPI = guestAPI;
        this.updateFields = Map.of(
                EventDAO.NAME_FIELD, UpdateEventDTO::name,
                EventDAO.INVITATION_TEXT_FIELD, UpdateEventDTO::invitationText,
                EventDAO.INVITATION_IMAGE_FIELD, u -> u.invitationImg() != null ? new Binary(BsonBinarySubType.BINARY, u.invitationImg().getBytes()) : null,
                EventDAO.TIME_FIELD, u -> u.time() != null ? u.time().toInstant().toEpochMilli() : null,
                EventDAO.DIAGRAM_FIELD, UpdateEventDTO::diagram
        );
    }

    public Mono<EventDAO> findByID(UUID eventUUID) {
        return reactiveMongoTemplate.findById(eventUUID, EventDAO.class);
    }

    public Flux<EventDAO> findAllByUserID(String userID) {
        return reactiveMongoTemplate.find(Query.query(where(EventDAO.OWNER_ID_FIELD).is(userID)), EventDAO.class);
    }

    public Mono<EventDAO> createEvent(@Valid @NotNull CreateEventDTO createEventDTO, String userID) {
        return Mono.just(this.createEventDAO(createEventDTO, userID))
                .flatMap(reactiveMongoTemplate::save)
                .switchIfEmpty(Mono.error(new RuntimeException("Failed to create an event")));
    }

    private EventDAO createEventDAO(CreateEventDTO createEventDTO, String userID) {
        return new EventDAO(UUID.randomUUID(),
                userID,
                createEventDTO.name(),
                createEventDTO.invitationText(),
                new Binary(BsonBinarySubType.BINARY, createEventDTO.invitationImg().getBytes()),
                createEventDTO.time().toInstant().toEpochMilli(),
                null);
    }

    public Mono<EventDAO> updateEvent(@Valid @NotNull UUID eventID, @Valid @NotNull UpdateEventDTO updateEventDTO, @NotNull @NotEmpty String userID) {
        return Mono.just(updateEventDTO)
                .map(this::createUpdateCommand)
                .flatMap(updateCommand -> reactiveMongoTemplate.findAndModify(Query.query(where(EventDAO.ID_FIELD).is(eventID).and(EventDAO.OWNER_ID_FIELD).is(userID)),
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

    public Mono<EventDAO> deleteEvent(@Valid @NotNull UUID eventID, @NotNull @NotEmpty String userID) {
        return reactiveMongoTemplate.findAndRemove(Query.query(where(EventDAO.ID_FIELD).is(eventID).and(EventDAO.OWNER_ID_FIELD).is(userID)), EventDAO.class);
    }

    public Mono<EventDAO> findEventByGuestID(UUID guestID) {
        Mono<GuestDTO> guest = guestAPI.getGuest(guestID);
        return guest.flatMap(guestDTO ->
                reactiveMongoTemplate.findById(UUID.fromString(guestDTO.eventID()), EventDAO.class)
        );
    }
}