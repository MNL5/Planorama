package com.planorama.backend.event.api;

import jakarta.annotation.Nullable;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;

public record UpdateEventDTO(@Nullable String name,
                             @Nullable String invitationText,
                             @Nullable MultipartFile invitationImg,
                             @Nullable OffsetDateTime time,
                             @Nullable String diagram) {
}
