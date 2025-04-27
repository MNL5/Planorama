package com.planorama.backend.event.mapper;

import com.planorama.backend.event.api.DiagramObjectDTO;
import com.planorama.backend.event.api.DiagramTableDTO;
import com.planorama.backend.event.entity.DiagramObjectDAO;
import com.planorama.backend.event.entity.DiagramTableDAO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DiagramObjectMapper {
    default DiagramObjectDTO daoToDTO(DiagramObjectDAO dao) {
        return mapTable((DiagramTableDAO) dao);
    }

    DiagramTableDTO mapTable(DiagramTableDAO diagramTableDAO);
}