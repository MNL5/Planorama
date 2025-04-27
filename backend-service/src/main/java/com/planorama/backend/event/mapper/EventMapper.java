package com.planorama.backend.event.mapper;

import com.planorama.backend.event.api.DiagramDTO;
import com.planorama.backend.event.api.EventDTO;
import com.planorama.backend.event.entity.DiagramObjectDAO;
import com.planorama.backend.event.entity.EventDAO;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@Mapper(componentModel = "spring",
        uses = DiagramObjectMapper.class,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface EventMapper {
    @Mapping(source = "invitationImg", target = "invitationImg", qualifiedByName = "binaryToString")
    @Mapping(source = "time", target = "time", qualifiedByName = "epochMillisToOffsetDateTime")
    @Mapping(source = "diagram", target = "diagram", qualifiedByName = "diagramWrapper")
    EventDTO daoToDTO(EventDAO eventDAO);

    @Named("binaryToString")
    default String binaryToString(org.bson.types.Binary binary) {
        return binary != null ? new String(binary.getData()) : null;
    }

    @Named("diagramWrapper")
    default DiagramDTO diagramWrapper(List<DiagramObjectDAO> elements) {
        if (elements == null) {
            return null;
        }
        DiagramObjectMapper mapper = Mappers.getMapper(DiagramObjectMapper.class);
        return new DiagramDTO(elements.stream().map(mapper::daoToDTO).toList());
    }

    @Named("epochMillisToOffsetDateTime")
    default OffsetDateTime epochMillisToOffsetDateTime(Long epochMillis) {
        return epochMillis != null ? OffsetDateTime.ofInstant(Instant.ofEpochMilli(epochMillis), ZoneId.systemDefault()) : null;
    }
}