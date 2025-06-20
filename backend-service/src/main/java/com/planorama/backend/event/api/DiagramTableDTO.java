package com.planorama.backend.event.api;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record DiagramTableDTO(@NotEmpty String color,
                              @NotNull @Positive Double height,
                              @NotEmpty String id,
                              @NotEmpty String label,
                              @NotNull @Positive Integer seatCount,
                              @NotEmpty String type,
                              @NotNull @Positive Double width,
                              @NotNull Double x,
                              @NotNull Double y) implements DiagramObjectDTO {
}