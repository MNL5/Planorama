package com.planorama.backend.event.api;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record DiagramDTO(@NotEmpty List<DiagramObjectDTO> elements) {
}
