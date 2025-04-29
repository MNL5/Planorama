package com.planorama.backend.task.api;

import java.util.UUID;

public record TaskDTO(UUID id,
                      String eventId,
                      String description,
                      Boolean fulfilled) {
}