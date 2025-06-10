package com.planorama.backend.seating;

import com.planorama.backend.event.api.DiagramDTO;
import com.planorama.backend.event.api.DiagramTableDTO;
import com.planorama.backend.event.api.EventAPI;
import com.planorama.backend.event.api.EventDTO;
import com.planorama.backend.guest.api.GuestAPI;
import com.planorama.backend.guest.api.RSVPStatusDTO;
import com.planorama.backend.relation.api.RelationAPI;
import com.planorama.backend.seating.api.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

@Service
public class SeatingService {
    private final EventAPI eventAPI;
    private final GuestAPI guestAPI;
    private final RelationAPI relationAPI;
    private final WebClient algoServiceClient;

    public SeatingService(EventAPI eventAPI,
                          GuestAPI guestAPI,
                          RelationAPI relationAPI,
                          @Qualifier("algoServiceClient") WebClient algoServiceClient) {
        this.eventAPI = eventAPI;
        this.guestAPI = guestAPI;
        this.relationAPI = relationAPI;
        this.algoServiceClient = algoServiceClient;
    }

    public Mono<SeatingResponse> autoSeat(UUID eventId) {
        return requestAiService(eventId, "/seating");
    }

    public Mono<SeatingResponse> satisfaction(UUID eventId) {
        return requestAiService(eventId, "/satisfaction");
    }

    public Mono<SeatingResponse> requestAiService(UUID eventId, String requestPath) {
        return Mono.zip(Flux.fromIterable(guestAPI.getAllGuestByEventID(eventId.toString()))
                                .filter(guest -> !RSVPStatusDTO.DECLINE.equals(guest.status()))
                                .map(guest -> new GuestApiDto(guest.id(), Optional.ofNullable(guest.group()).orElse(guest.id().toString()), guest.tableId(), null))
                                .collectList(),
                        Mono.just(eventAPI.getEventByID(eventId))
                                .map(EventDTO::diagram)
                                .map(DiagramDTO::elements)
                                .filter(Objects::nonNull)
                                .flatMapIterable(Function.identity())
                                .filter(DiagramTableDTO.class::isInstance)
                                .map(DiagramTableDTO.class::cast)
                                .map(table -> new TableApiDto(table.id(), table.seatCount()))
                                .filter(table -> table.numOfSeats() != null)
                                .collectList(),
                        Flux.fromIterable(relationAPI.getAllRelationsByEventID(eventId.toString()))
                                .map(relation -> new RelationApiDto(relation.firstGuestId(), relation.secondGuestId(), relation.relation().name()))
                                .collectList())
                .map(tuple -> new SeatingRequest(tuple.getT1(), tuple.getT2(), tuple.getT3()))
                .flatMap(request -> algoServiceClient.post()
                        .uri(requestPath)
                        .bodyValue(request)
                        .retrieve()
                        .bodyToMono(SeatingResponse.class))
                .onErrorResume(error -> Mono.error(new RuntimeException("Failed to update seating diagram", error)));
    }
}