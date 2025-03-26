package com.planorama.backend.event.mapper;

import com.planorama.backend.event.api.EventDTO;
import com.planorama.backend.event.entity.EventDAO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Base64;

@Mapper(componentModel = "spring")
public interface EventMapper {
    @Mapping(source = "invitationImg", target = "invitationImg", qualifiedByName = "binaryToBase64")
    EventDTO daoToDTO(EventDAO eventDAO);

    @Named("binaryToBase64")
    default String binaryToBase64(org.bson.types.Binary binary) {
        return binary != null ? Base64.getEncoder().encodeToString(binary.getData()) : null;
    }
}
