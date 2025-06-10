package com.planorama.backend.event.api;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "elementType", defaultImpl = DiagramTableDTO.class)
@JsonSubTypes({
        @JsonSubTypes.Type(value = DiagramTableDTO.class, name = "table"),
        @JsonSubTypes.Type(value = DiagramTextDTO.class, name = "text")
})
public sealed interface DiagramObjectDTO permits DiagramTableDTO, DiagramTextDTO {
}