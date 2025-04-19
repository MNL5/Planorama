package com.planorama.backend.event.api;

import com.planorama.backend.event.EventService;
import com.planorama.backend.event.mapper.EventMapper;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("events")
public class EventController {
    private final EventService eventService;
    private final EventMapper eventMapper;

    public EventController(EventService eventService,
                           EventMapper eventMapper) {
        this.eventService = eventService;
        this.eventMapper = eventMapper;
    }

    @GetMapping("/{eventId}")
    public Mono<EventDTO> getEventByID(@PathVariable("eventId") UUID eventUUID) {
        return eventService.findByID(eventUUID)
                .map(eventMapper::daoToDTO);
    }

    @GetMapping("/list")
    public Flux<EventDTO> getAllEvents(@NotNull @NotEmpty @RequestAttribute("ownerID") String userID) {
        return eventService.findAllByUserID(userID)
                .map(eventMapper::daoToDTO);
    }

    @GetMapping
    public Mono<EventDTO> getEventByGuestID(@RequestParam("guest") UUID guestID) {
        throw new UnsupportedOperationException("Until Guest are implemented");
    }

    @PostMapping
    public Mono<EventDTO> createEvent(@RequestBody CreateEventDTO createEventDTO,
                                      @NotNull @NotEmpty @RequestAttribute("ownerID") String userID) {
        return eventService.createEvent(createEventDTO, userID)
                .map(eventMapper::daoToDTO);
    }

    @PutMapping("/{eventId}")
    public Mono<EventDTO> updateEvent(@PathVariable("eventId") UUID eventUUID,
                                      @RequestBody UpdateEventDTO createEventDTO,
                                      @NotNull @NotEmpty @RequestAttribute("ownerID") String userID) {
        return eventService.updateEvent(eventUUID, createEventDTO, userID)
                .map(eventMapper::daoToDTO);
    }

    @DeleteMapping("/{eventId}")
    public Mono<EventDTO> deleteEvent(@PathVariable("eventId") UUID eventID,
                                      @NotNull @NotEmpty @RequestAttribute("ownerID") String userID) {
        return eventService.deleteEvent(eventID, userID)
                .map(eventMapper::daoToDTO);
    }
}