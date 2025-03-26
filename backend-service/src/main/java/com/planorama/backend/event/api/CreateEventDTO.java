package com.planorama.backend.event.api;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;

public record CreateEventDTO(@NotNull @NotEmpty String name,
                             @NotNull @NotEmpty String invitationText,
                             @NotNull MultipartFile invitationImg,
                             @NotNull @PastOrPresent OffsetDateTime time) {
}
