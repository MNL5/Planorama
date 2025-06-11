package com.planorama.backend.guest;

import com.mongodb.bulk.BulkWriteResult;
import com.planorama.backend.event.api.DeleteEvent;
import com.planorama.backend.guest.api.*;
import com.planorama.backend.guest.entity.GuestDAO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.ReactiveBulkOperations;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.query.UpdateDefinition;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class GuestService {
    private final ReactiveMongoTemplate reactiveMongoTemplate;
    private final ApplicationEventPublisher eventPublisher;
    private final Map<String, UpdateGuestFieldExtractor> updateFields;
    private final PhoneNumberValidator phoneNumberValidator;

    public GuestService(ReactiveMongoTemplate reactiveMongoTemplate,
                        ApplicationEventPublisher eventPublisher,
                        PhoneNumberValidator phoneNumberValidator) {
        this.reactiveMongoTemplate = reactiveMongoTemplate;
        this.eventPublisher = eventPublisher;
        this.phoneNumberValidator = phoneNumberValidator;
        this.updateFields = Map.of(
                GuestDAO.NAME_FIELD, new UpdateGuestFieldExtractor(UpdateGuestDTO::name, UpdateGuestDTO::name),
                GuestDAO.PHONE_NUMBER_FIELD, new UpdateGuestFieldExtractor(UpdateGuestDTO::phoneNumber, u -> phoneNumberValidator.normalize(u.phoneNumber()).orElse(null)),
                GuestDAO.GENDER_FIELD, new UpdateGuestFieldExtractor(UpdateGuestDTO::gender, UpdateGuestDTO::gender),
                GuestDAO.GROUP_FIELD, new UpdateGuestFieldExtractor(UpdateGuestDTO::group, UpdateGuestDTO::group),
                GuestDAO.MEAL_FIELD, new UpdateGuestFieldExtractor(UpdateGuestDTO::meal, u -> u.meal() != null ? u.meal().stream().map(Enum::name).collect(Collectors.toSet()) : null),
                GuestDAO.STATUS_FIELD, new UpdateGuestFieldExtractor(UpdateGuestDTO::status, u -> u.status() != null ? u.status().name() : null),
                GuestDAO.TABLE_FIELD, new UpdateGuestFieldExtractor(UpdateGuestDTO::tableId, UpdateGuestDTO::tableId)
        );
    }

    private record UpdateGuestFieldExtractor(Function<UpdateGuestDTO, Object> rawValue,
                                             Function<UpdateGuestDTO, Object> updateValue) {
    }

    @Async
    @EventListener
    public void removeEvent(DeleteEvent deleteEvent) {
        reactiveMongoTemplate.remove(Query.query(Criteria.where(GuestDAO.EVENT_ID_FIELD)
                        .is(deleteEvent.eventId())))
                .retry()
                .subscribe();
    }

    public Mono<GuestDAO> getGuest(UUID guestId) {
        return reactiveMongoTemplate.findById(guestId, GuestDAO.class);
    }

    public Flux<GuestDAO> findAllByEventId(@NotNull String eventId) {
        return reactiveMongoTemplate.find(Query.query(Criteria.where(GuestDAO.EVENT_ID_FIELD).is(eventId)), GuestDAO.class);
    }

    public Flux<GuestDAO> findAllByEventIdAndTableId(@NotNull String eventId, @NotNull String tableId) {
        return reactiveMongoTemplate.find(Query.query(Criteria.where(GuestDAO.EVENT_ID_FIELD).is(eventId).and(GuestDAO.TABLE_FIELD).is(tableId)), GuestDAO.class);
    }

    public Flux<GuestDAO> findAllByEventIdAndRsvpStatus(@NotNull String eventId, @NotNull Set<RSVPStatusDTO> rsvpStatus) {
        Set<String> statuses = rsvpStatus.stream().map(Enum::name).collect(Collectors.toSet());
        return reactiveMongoTemplate.find(Query.query(Criteria.where(GuestDAO.EVENT_ID_FIELD).is(eventId)
                .and(GuestDAO.STATUS_FIELD).in(statuses)), GuestDAO.class);
    }

    public Mono<GuestDAO> createGuest(@Valid @NotNull CreateGuestDTO createGuestDTO) {
        Optional<String> normalizePhoneNumber = phoneNumberValidator.normalize(createGuestDTO.phoneNumber());
        return normalizePhoneNumber.map(s -> reactiveMongoTemplate.save(createGuestDao(createGuestDTO, s))
                        .switchIfEmpty(Mono.error(new RuntimeException("Failed to create an guest"))))
                .orElseGet(() -> Mono.error(new IllegalArgumentException("Phone number format is invalid")));

    }

    private GuestDAO createGuestDao(CreateGuestDTO createGuestDTO, String normalizePhoneNumber) {
        return new GuestDAO(UUID.randomUUID(),
                createGuestDTO.eventId(),
                createGuestDTO.name(),
                normalizePhoneNumber,
                createGuestDTO.gender(),
                createGuestDTO.group(),
                createGuestDTO.status() != null ? createGuestDTO.status().name() : RSVPStatusDTO.TENTATIVE.name(),
                createGuestDTO.meal() != null ? createGuestDTO.meal().stream().map(Enum::name).collect(Collectors.toSet()) : Set.of(),
                createGuestDTO.tableId() != null ? createGuestDTO.tableId() : "");
    }

    public Mono<GuestDAO> updateGuest(UpdateGuestDTO updateGuestDTO, UUID guestId) {
        return reactiveMongoTemplate.findAndModify(Query.query(Criteria.where(GuestDAO.ID_FIELD).is(guestId)),
                createUpdateCommand(updateGuestDTO),
                FindAndModifyOptions.options().returnNew(true),
                GuestDAO.class);
    }

    public Mono<BulkWriteResult> updateGuests(GuestsUpdateDTO guestsUpdateDTO) {
        ReactiveBulkOperations bulkOps = reactiveMongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, GuestDAO.class);
        guestsUpdateDTO.guests().forEach((guestId, updateDto) -> bulkOps.updateOne(
                Query.query(Criteria.where(GuestDAO.ID_FIELD).is(guestId)),
                createUpdateCommand(updateDto)));
        return bulkOps.execute();
    }

    private UpdateDefinition createUpdateCommand(UpdateGuestDTO updateGuestDTO) {
        final Update update = new Update();

        updateFields.forEach((key, extractor) -> {
            Object sourceValue = extractor.rawValue().apply(updateGuestDTO);
            if (sourceValue != null) {
                Object valueToUpdate = extractor.updateValue().apply(updateGuestDTO);
                if (valueToUpdate != null) {
                    update.set(key, valueToUpdate);
                } else {
                    throw new IllegalArgumentException(String.format("Failed to update guest, The value of field %s is invalid", key));
                }
            }
        });
        return update;
    }

    public Mono<GuestDAO> deleteGuest(@Valid @NotNull UUID guestId) {
        return reactiveMongoTemplate.findAndRemove(Query.query(Criteria.where(GuestDAO.ID_FIELD).is(guestId)), GuestDAO.class)
                .doOnNext(dao -> eventPublisher.publishEvent(new DeleteGuest(guestId.toString())));
    }
}