package com.planorama.backend.task.api;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotEmpty;

public record CreateTaskDTO(@NotEmpty String eventId,
                            @NotEmpty String description,
                            @Nullable Boolean fulfilled) {
}