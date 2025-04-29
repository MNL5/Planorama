package com.planorama.backend.seating.api;

import java.util.UUID;

public record GuestApiDto(UUID id, String group, String table) {
}