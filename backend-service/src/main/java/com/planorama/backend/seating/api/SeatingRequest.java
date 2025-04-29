package com.planorama.backend.seating.api;

import java.util.List;

public record SeatingRequest(List<GuestApiDto> guests,
                             List<TableApiDto> tables,
                             List<RelationApiDto> relations) {
}
