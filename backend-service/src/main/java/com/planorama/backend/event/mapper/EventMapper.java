package com.planorama.backend.event.mapper;

import com.planorama.backend.event.api.EventDTO;
import com.planorama.backend.event.entity.EventDAO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;

@Mapper(componentModel = "spring")
public interface EventMapper {
    @Mapping(source = "invitationImg", target = "invitationImg", qualifiedByName = "binaryToString")
    @Mapping(source = "time", target = "time", qualifiedByName = "epochMillisToOffsetDateTime")
    EventDTO daoToDTO(EventDAO eventDAO);

    @Named("binaryToString")
    default String binaryToString(org.bson.types.Binary binary) {
        return binary != null ? new String(binary.getData()) : null;
    }

    @Named("epochMillisToOffsetDateTime")
    default OffsetDateTime epochMillisToOffsetDateTime(Long epochMillis) {
        return epochMillis != null ? OffsetDateTime.ofInstant(Instant.ofEpochMilli(epochMillis), ZoneId.systemDefault()) : null;
    }
}