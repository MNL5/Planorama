package com.planorama.backend.gift;

import com.planorama.backend.gift.api.UpdateGiftDTO;
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
import java.util.UUID;
import java.util.function.Function;

@Service
public class GiftService {
    private final ReactiveMongoTemplate reactiveMongoTemplate;
    private final Map<String, Function<UpdateGiftDTO, Object>> updateFields;

    public GiftService(ReactiveMongoTemplate reactiveMongoTemplate) {
        this.reactiveMongoTemplate = reactiveMongoTemplate;
        this.updateFields = Map.of(
                GiftDAO.GREETING_FIELD, UpdateGiftDTO::greeting,
                GiftDAO.AMOUNT_FIELD, UpdateGiftDTO::amount
        );
    }

    public Flux<GiftDAO> findGiftByEventID(String eventID) {
        return reactiveMongoTemplate.find(Query.query(Criteria.where(GiftDAO.EVENT_FIELD).is(eventID)), GiftDAO.class);
    }

    public Mono<GiftDAO> upsertGift(UpsertGiftDTO upsertGiftDTO) {
        return Mono.empty();
//        return reactiveMongoTemplate
//                .upsert(createGiftDAO(upsertGiftDTO))
//                .onErrorResume(e -> Mono.error(new RuntimeException("Failed to save Gift", e)));
    }

    private GiftDAO createGiftDAO(UpsertGiftDTO upsertGiftDTO) {
        return new GiftDAO(UUID.randomUUID(),
                upsertGiftDTO.eventId(),
                upsertGiftDTO.guestId(),
                upsertGiftDTO.amount(),
                upsertGiftDTO.greeting());
    }

    public Mono<GiftDAO> updateGift(String giftId, UpdateGiftDTO updateGiftDTO) {
        return reactiveMongoTemplate.findAndModify(Query.query(Criteria.where(GiftDAO.ID_FIELD).is(giftId)),
                createUpdateCommand(updateGiftDTO),
                FindAndModifyOptions.options().returnNew(true),
                GiftDAO.class);
    }

    private Update createUpdateCommand(UpdateGiftDTO updateGiftDTO) {
        final Update update = new Update();

        updateFields.forEach((key, extractor) -> {
            Object value = extractor.apply(updateGiftDTO);
            if (value != null) update.set(key, value);
        });
        return update;
    }

    public Mono<GiftDAO> deleteGift(UUID giftID) {
        return reactiveMongoTemplate.findAndRemove(Query.query(Criteria.where(GiftDAO.ID_FIELD).is(giftID)), GiftDAO.class);
    }
}