package com.planorama.backend.task.api;

import jakarta.annotation.Nullable;

public record UpdateTaskDTO(@Nullable String description,
                            @Nullable Boolean fulfilled) {
}