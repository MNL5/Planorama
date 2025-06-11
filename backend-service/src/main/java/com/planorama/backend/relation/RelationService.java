package com.planorama.backend.relation;

import com.planorama.backend.event.api.DeleteEvent;
import com.planorama.backend.guest.api.DeleteGuest;
import com.planorama.backend.relation.api.CreateRelationDTO;
import com.planorama.backend.relation.api.UpdateRelationDTO;
import com.planorama.backend.relation.entity.RelationDAO;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class RelationService {
    private final ReactiveMongoTemplate reactiveMongoTemplate;
    private final Map<String, Function<UpdateRelationDTO, Object>> updateFields;

    public RelationService(ReactiveMongoTemplate reactiveMongoTemplate) {
        this.reactiveMongoTemplate = reactiveMongoTemplate;
        this.updateFields = Map.of(RelationDAO.RELATION_FIELD, u -> u.relation() != null ? u.relation().name() : null);
    }

    @Async
    @EventListener
    public void removeEvent(DeleteEvent deleteEvent) {
        reactiveMongoTemplate.remove(Query.query(Criteria.where(RelationDAO.EVENT_ID_FIELD)
                        .is(deleteEvent.eventId())))
                .retry()
                .subscribe();
    }

    @Async
    @EventListener
    public void removeGuest(DeleteGuest deleteGuest) {
        reactiveMongoTemplate.remove(Query.query(new Criteria().orOperator(
                        Criteria.where(RelationDAO.FIRST_GUEST_ID_FIELD).is(deleteGuest.guestId()),
                        Criteria.where(RelationDAO.SECOND_GUEST_ID_FIELD).is(deleteGuest.guestId())
                )), RelationDAO.class)
                .subscribe();
    }

    public Mono<RelationDAO> findById(UUID relationId) {
        return reactiveMongoTemplate.findById(relationId, RelationDAO.class);
    }

    public Flux<RelationDAO> findAllByEventId(String eventId) {
        return reactiveMongoTemplate.find(Query.query(Criteria.where(RelationDAO.EVENT_ID_FIELD).is(eventId)), RelationDAO.class);
    }

    public Mono<RelationDAO> createRelation(CreateRelationDTO createRelationDTO) {
        return reactiveMongoTemplate.save(createRelationDAO(createRelationDTO));
    }

    private RelationDAO createRelationDAO(CreateRelationDTO createRelationDTO) {
        String normalizeRelationKey = Stream.of(createRelationDTO.firstGuestId(), createRelationDTO.secondGuestId())
                .sorted()
                .collect(Collectors.joining());
        return new RelationDAO(UUID.randomUUID(),
                createRelationDTO.eventId(),
                normalizeRelationKey,
                createRelationDTO.firstGuestId(),
                createRelationDTO.secondGuestId(),
                createRelationDTO.relation());
    }

    public Mono<RelationDAO> updateRelation(UpdateRelationDTO updateRelationDTO, UUID relationId) {
        return reactiveMongoTemplate.findAndModify(Query.query(Criteria.where(RelationDAO.ID_FIELD).is(relationId)),
                createUpdateCommand(updateRelationDTO),
                FindAndModifyOptions.options().returnNew(true),
                RelationDAO.class);
    }

    private Update createUpdateCommand(UpdateRelationDTO updateRelationDTO) {
        final Update update = new Update();

        updateFields.forEach((key, extractor) -> {
            Object value = extractor.apply(updateRelationDTO);
            if (value != null) update.set(key, value);
        });
        return update;
    }

    public Mono<RelationDAO> deleteRelation(UUID relationId) {
        return reactiveMongoTemplate.findAndRemove(Query.query(Criteria.where(RelationDAO.ID_FIELD).is(relationId)), RelationDAO.class);
    }
}