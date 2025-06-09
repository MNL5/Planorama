package com.planorama.backend.event;

import com.planorama.backend.event.api.CreateEventDTO;
import com.planorama.backend.event.api.EventAPI;
import com.planorama.backend.event.api.EventDTO;
import com.planorama.backend.event.api.UpdateEventDTO;
import com.planorama.backend.event.mapper.EventMapper;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("events")
public class EventController implements EventAPI {
    private final EventService eventService;
    private final EventMapper eventMapper;

    public EventController(EventService eventService,
                           EventMapper eventMapper) {
        this.eventService = eventService;
        this.eventMapper = eventMapper;
    }

    @GetMapping("/{eventId}")
    @Override
    @PreAuthorize("hasAuthority(#eventUUID)")
    public EventDTO getEventByID(@PathVariable("eventId") UUID eventUUID) {
        return eventService.findByID(eventUUID)
                .map(eventMapper::daoToDTO)
                .block();
    }

    @GetMapping("/list")
    @Override
    public List<EventDTO> getAllEvents(@NotNull @NotEmpty @RequestAttribute("userID") String userID) {
        return eventService.findAllByUserID(userID)
                .map(eventMapper::daoToDTO)
                .collectList()
                .block();
    }

    @GetMapping
    public EventDTO getEventByGuestID(@RequestParam("guest") UUID guestID) {
        return eventService.findEventByGuestID(guestID)
                .map(eventMapper::daoToDTO)
                .block();
    }

    @Override
    public List<EventDTO> getEventBetweenDates(@NotNull OffsetDateTime from,
                                               @NotNull OffsetDateTime to) {
        return eventService.findEventsBetweenDates(from, to)
                .map(eventMapper::daoToDTO)
                .collectList()
                .block();
    }

    @PostMapping
    public EventDTO createEvent(@RequestBody CreateEventDTO createEventDTO,
                                @NotNull @NotEmpty @RequestAttribute("userID") String userID) {
        return eventService.createEvent(createEventDTO, userID)
                .map(eventMapper::daoToDTO)
                .block();
    }

    @PutMapping("/{eventId}")
    @PreAuthorize("hasAuthority(#eventID)")
    public EventDTO updateEvent(@PathVariable("eventId") UUID eventID,
                                @RequestBody UpdateEventDTO updateEventDTO) {
        return eventService.updateEvent(eventID, updateEventDTO)
                .map(eventMapper::daoToDTO)
                .block();
    }

    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasAuthority(#eventID)")
    public String deleteEvent(@PathVariable("eventId") UUID eventID) {
        return eventService.deleteEvent(eventID)
                .map(Object::toString)
                .block();
    }
}