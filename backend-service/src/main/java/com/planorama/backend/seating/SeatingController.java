package com.planorama.backend.seating;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/seating")
public class SeatingController {
    private final SeatingService seatingService;

    public SeatingController(SeatingService seatingService) {
        this.seatingService = seatingService;
    }

    @GetMapping("/{eventId}")
    public Mono<String> autoSeat(@PathVariable("eventId") UUID eventId) {
        return seatingService.autoSeat(eventId)
                .map(tableChanges -> String.format("%n Tables changed"));
    }
}