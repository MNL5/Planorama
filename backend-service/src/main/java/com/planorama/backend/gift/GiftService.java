package com.planorama.backend.gift;

import com.planorama.backend.gift.api.UpsertGiftDTO;
import com.planorama.backend.gift.entity.GiftDAO;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.function.BiFunction;

@Service
public class GiftService {
    private static final String EMPTY_GREETING = "*No greeting was added*";
    private final ReactiveMongoTemplate reactiveMongoTemplate;
    private final Map<String, BiFunction<GiftDAO, UpsertGiftDTO, Object>> updateFields;

    public GiftService(ReactiveMongoTemplate reactiveMongoTemplate) {
        this.reactiveMongoTemplate = reactiveMongoTemplate;
        this.updateFields = Map.of(
                GiftDAO.AMOUNT_FIELD, (dao, gift) -> dao.amount() + gift.amount(),
                GiftDAO.GREETING_FIELD, (dao, gift) -> dao.greeting().concat("\n----------\n").concat(Optional.ofNullable(gift.greeting()).orElse(EMPTY_GREETING))
        );
    }

    public Flux<GiftDAO> findGiftByEventID(String eventID) {
        return reactiveMongoTemplate.find(Query.query(Criteria.where(GiftDAO.EVENT_FIELD).is(eventID)), GiftDAO.class);
    }

    public Mono<GiftDAO> upsertGift(UpsertGiftDTO upsertGiftDTO) {
        return reactiveMongoTemplate.findOne(Query.query(Criteria.where(GiftDAO.EVENT_FIELD).is(upsertGiftDTO.eventId())
                        .and(GiftDAO.GUEST_FIELD).is(upsertGiftDTO.guestId())), GiftDAO.class)
                .flatMap(currentGift -> reactiveMongoTemplate.findAndModify(Query.query(Criteria.where(GiftDAO.ID_FIELD).is(currentGift.id())),
                        createUpdateCommand(currentGift, upsertGiftDTO),
                        FindAndModifyOptions.options().returnNew(true),
                        GiftDAO.class))
                .switchIfEmpty(reactiveMongoTemplate.save(createGiftDAO(upsertGiftDTO)))
                .flatMap(reactiveMongoTemplate::save)
                .onErrorResume(e -> Mono.error(new RuntimeException("Failed to save Gift", e)));
    }

    private GiftDAO createGiftDAO(UpsertGiftDTO upsertGiftDTO) {
        return new GiftDAO(UUID.randomUUID(),
                upsertGiftDTO.eventId(),
                upsertGiftDTO.guestId(),
                upsertGiftDTO.amount(),
                Optional.ofNullable(upsertGiftDTO.greeting()).orElse(EMPTY_GREETING));
    }

    private Update createUpdateCommand(GiftDAO giftDAO, UpsertGiftDTO upsertGiftDTO) {
        final Update update = new Update();

        updateFields.forEach((key, extractor) -> {
            Object value = extractor.apply(giftDAO, upsertGiftDTO);
            if (value != null) update.set(key, value);
        });
        return update;
    }
}