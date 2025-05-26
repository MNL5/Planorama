package com.planorama.backend.event.mapper;

import com.planorama.backend.event.api.DiagramObjectDTO;
import com.planorama.backend.event.api.DiagramTableDTO;
import com.planorama.backend.event.api.DiagramTextDTO;
import com.planorama.backend.event.entity.DiagramObjectDAO;
import com.planorama.backend.event.entity.DiagramTableDAO;
import com.planorama.backend.event.entity.DiagramTextDAO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DiagramObjectMapper {
    default DiagramObjectDTO daoToDTO(DiagramObjectDAO dao) {
        return switch (dao) {
            case DiagramTableDAO table -> mapTable(table);
            case DiagramTextDAO text -> mapText(text);
        };
    }

    DiagramTableDTO mapTable(DiagramTableDAO diagramTableDAO);

    DiagramTextDTO mapText(DiagramTextDAO diagramTextDAO);
}