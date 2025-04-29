package com.planorama.backend.seating;

import com.planorama.backend.event.api.DiagramDTO;
import com.planorama.backend.event.api.DiagramTableDTO;
import com.planorama.backend.event.api.EventAPI;
import com.planorama.backend.event.api.EventDTO;
import com.planorama.backend.guest.api.GuestAPI;
import com.planorama.backend.guest.api.RSVPStatusDTO;
import com.planorama.backend.guest.api.SeatGuests;
import com.planorama.backend.relation.api.RelationAPI;
import com.planorama.backend.seating.api.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class SeatingService {
    private final EventAPI eventAPI;
    private final GuestAPI guestAPI;
    private final RelationAPI relationAPI;
    private final WebClient algoServiceClient;
    private final ApplicationEventPublisher eventPublisher;

    public SeatingService(EventAPI eventAPI,
                          GuestAPI guestAPI,
                          RelationAPI relationAPI,
                          @Qualifier("algoServiceClient") WebClient algoServiceClient,
                          ApplicationEventPublisher eventPublisher
    ) {
        this.eventAPI = eventAPI;
        this.guestAPI = guestAPI;
        this.relationAPI = relationAPI;
        this.algoServiceClient = algoServiceClient;
        this.eventPublisher = eventPublisher;
    }

    public Mono<Long> autoSeat(UUID eventId) {
        return Mono.zip(guestAPI.getAllGuestByEventID(eventId.toString())
                                .filter(guest -> !RSVPStatusDTO.DECLINE.equals(guest.status()))
                                .map(guest -> new GuestApiDto(guest.id(), guest.group(), guest.tableId()))
                                .collectList(),
                        eventAPI.getEventByID(eventId)
                                .map(EventDTO::diagram)
                                .map(DiagramDTO::elements)
                                .filter(Objects::isNull)
                                .flatMapIterable(Function.identity())
                                .filter(DiagramTableDTO.class::isInstance)
                                .map(DiagramTableDTO.class::cast)
                                .map(table -> new TableApiDto(table.id(), table.seatCount()))
                                .collectList(),
                        relationAPI.getAllRelationsByEventID(eventId.toString())
                                .map(relation -> new RelationApiDto(relation.firstGuestId(), relation.secondGuestId(), relation.relation().name()))
                                .collectList())
                .map(tuple -> new SeatingRequest(tuple.getT1(), tuple.getT2(), tuple.getT3()))
                .flatMap(request -> {
                            Map<String, Set<UUID>> currentSeating = request.guests().stream().filter(guest -> Objects.nonNull(guest.table())).collect(Collectors.groupingBy(GuestApiDto::table, Collectors.mapping(GuestApiDto::id, Collectors.toSet())));
                            return algoServiceClient.post()
                                    .bodyValue(request)
                                    .retrieve()
                                    .bodyToMono(SeatingResponse.class)
                                    .flatMapIterable(SeatingResponse::guests)
                                    .filter(guest -> currentSeating.get(guest.table()).contains(guest.id()))
                                    .collect(Collectors.groupingBy(GuestApiDto::table, Collectors.mapping(GuestApiDto::id, Collectors.toSet())));
                        }
                ).flatMapIterable(tableArrangement -> tableArrangement
                        .entrySet()
                        .stream()
                        .map(guestsEntry -> new SeatGuests(this, guestsEntry.getValue(), guestsEntry.getKey()))
                        .toList())
                .doOnNext(eventPublisher::publishEvent)
                .onErrorResume(error -> Mono.error(new RuntimeException("Failed to update seating diagram", error)))
                .count();
    }
}