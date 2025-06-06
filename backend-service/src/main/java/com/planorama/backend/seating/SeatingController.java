package com.planorama.backend.seating;

import com.planorama.backend.seating.api.SeatingResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/seating")
public class SeatingController {
    private final SeatingService seatingService;

    public SeatingController(SeatingService seatingService) {
        this.seatingService = seatingService;
    }

    @GetMapping("/{eventId}")
    @PreAuthorize("hasAuthority(#eventId)")
    public SeatingResponse autoSeat(@PathVariable("eventId") UUID eventId) {
        return seatingService.autoSeat(eventId)
                .block();
    }

    @GetMapping("/satisfaction/{eventId}")
    @PreAuthorize("hasAuthority(#eventId)")
    public SeatingResponse satisfaction(@PathVariable("eventId") UUID eventId) {
        return seatingService.satisfaction(eventId)
                .block();
    }
}