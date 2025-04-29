package com.planorama.backend.seating.api;

import java.util.List;

public record SeatingResponse(List<GuestApiDto> guests) {
}
