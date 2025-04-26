package com.planorama.backend.event.api;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;

import java.time.OffsetDateTime;

public record CreateEventDTO(@NotNull @NotEmpty String name,
                             @NotNull @NotEmpty String invitationText,
                             @NotNull @NotEmpty String invitationImg,
                             @NotNull @PastOrPresent OffsetDateTime time) {
}
