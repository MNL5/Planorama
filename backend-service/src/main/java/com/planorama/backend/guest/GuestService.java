package com.planorama.backend.guest;

import com.planorama.backend.guest.api.CreateGuestDTO;
import com.planorama.backend.guest.api.RSVPStatusDTO;
import com.planorama.backend.guest.api.UpdateGuestDTO;
import com.planorama.backend.guest.entity.GuestDAO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class GuestService {
    private final ReactiveMongoTemplate reactiveMongoTemplate;
    private final Map<String, Function<UpdateGuestDTO, Object>> updateFields;

    public GuestService(ReactiveMongoTemplate reactiveMongoTemplate) {
        this.reactiveMongoTemplate = reactiveMongoTemplate;
        this.updateFields = Map.of(
                GuestDAO.NAME_FIELD, UpdateGuestDTO::name,
                GuestDAO.PHONE_NUMBER_FIELD, UpdateGuestDTO::phoneNumber,
                GuestDAO.GENDER_FIELD, UpdateGuestDTO::gender,
                GuestDAO.GROUP_FIELD, UpdateGuestDTO::group,
                GuestDAO.MEAL_FIELD, u -> u.meal() != null ? u.meal().stream().map(Enum::name).collect(Collectors.toSet()) : null,
                GuestDAO.STATUS_FIELD, u -> u.status() != null ? u.status().name() : null,
                GuestDAO.TABLE_FIELD, UpdateGuestDTO::table
        );
    }

    public Mono<GuestDAO> getGuest(UUID guestId) {
        return reactiveMongoTemplate.findById(guestId, GuestDAO.class);
    }

    public Flux<GuestDAO> findAllByEventId(@NotNull String eventId) {
        return reactiveMongoTemplate.find(Query.query(Criteria.where(GuestDAO.EVENT_ID_FIELD).is(eventId)), GuestDAO.class);
    }

    public Mono<GuestDAO> createGuest(@Valid @NotNull CreateGuestDTO createGuestDTO) {
        return reactiveMongoTemplate.save(createGuestDao(createGuestDTO))
                .switchIfEmpty(Mono.error(new RuntimeException("Failed to create an guest")));
    }

    private GuestDAO createGuestDao(CreateGuestDTO createGuestDTO) {
        return new GuestDAO(UUID.randomUUID(),
                createGuestDTO.eventId(),
                createGuestDTO.name(),
                createGuestDTO.phoneNumber(),
                createGuestDTO.gender(),
                createGuestDTO.group(),
                RSVPStatusDTO.TENTATIVE.name(),
                Set.of(),
                null);
    }

    public Mono<GuestDAO> updateGuest(UpdateGuestDTO updateGuestDTO, String guestId) {
        return reactiveMongoTemplate.findAndModify(Query.query(Criteria.where(GuestDAO.ID_FIELD).is(guestId)), createUpdateCommand(updateGuestDTO), GuestDAO.class);
    }

    private Update createUpdateCommand(UpdateGuestDTO updateGuestDTO) {
        final Update update = new Update();

        updateFields.forEach((key, extractor) -> {
            Object value = extractor.apply(updateGuestDTO);
            if (value != null) update.set(key, value);
        });
        return update;
    }

    public Mono<GuestDAO> deleteGuest(@Valid @NotNull UUID guestId) {
        return reactiveMongoTemplate.findAndRemove(Query.query(Criteria.where(GuestDAO.ID_FIELD).is(guestId)), GuestDAO.class);
    }
}
