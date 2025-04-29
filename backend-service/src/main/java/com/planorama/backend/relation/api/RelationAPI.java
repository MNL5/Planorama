package com.planorama.backend.relation.api;

import reactor.core.publisher.Flux;

public interface RelationAPI {
    Flux<RelationDTO> getAllRelationsByEventID(String eventId);
}
