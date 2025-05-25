package com.planorama.backend.relation.api;

import com.planorama.backend.common.EventEntityAPI;

import java.util.List;

public interface RelationAPI extends EventEntityAPI<RelationDTO> {
    List<RelationDTO> getAllRelationsByEventID(String eventId);
}
