package com.planorama.backend.event.api;

import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("events")
public class EventController {
    @GetMapping("/{eventId}")
    public EventDTO getEvent(@PathVariable("eventId") UUID eventUUID) {
        throw new UnsupportedOperationException();
    }

    @GetMapping("")
    public EventDTO getEventByGuestID(@RequestParam("guest") UUID guestID) {
        throw new UnsupportedOperationException("Until Guest are implemented");
    }

    @PostMapping
    public CreateEventDTO createEvent(@RequestBody CreateEventDTO createEventDTO) {
        throw new UnsupportedOperationException();
    }

    @PutMapping("/{eventId}")
    public CreateEventDTO updateEvent(@PathVariable("eventId") UUID eventUUID,
                                      @RequestBody UpdateEventDTO createEventDTO) {
        throw new UnsupportedOperationException();
    }

    @DeleteMapping("/{eventId}")
    public EventDTO deleteEvent(@PathVariable("eventId") UUID eventUUID) {
        throw new UnsupportedOperationException();
    }
}