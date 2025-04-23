package com.planorama.backend.relation.mapper;

import com.planorama.backend.relation.api.RelationDTO;
import com.planorama.backend.relation.api.RelationStatus;
import com.planorama.backend.relation.entity.RelationDAO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface RelationMapper {
    @Mapping(source = "relation", target = "relation", qualifiedByName = "relationToDTO")
    RelationDTO daoToDTO(RelationDAO relationDAO);

    @Named("relationToDTO")
    default RelationStatus relationToDTO(String relation) {
        return relation != null ? RelationStatus.valueOf(relation) : null;
    }
}