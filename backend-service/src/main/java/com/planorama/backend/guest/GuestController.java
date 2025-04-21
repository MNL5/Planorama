package com.planorama.backend.guest;

import com.planorama.backend.guest.api.CreateGuestDTO;
import com.planorama.backend.guest.api.GuestAPI;
import com.planorama.backend.guest.api.GuestDTO;
import com.planorama.backend.guest.api.UpdateGuestDTO;
import com.planorama.backend.guest.mapper.GuestMapper;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("guests")
public class GuestController implements GuestAPI {
    private final GuestService guestService;
    private final GuestMapper guestMapper;

    public GuestController(GuestService guestService, GuestMapper guestMapper) {
        this.guestService = guestService;
        this.guestMapper = guestMapper;
    }

    @GetMapping("/{guestId}")
    @Override
    public Mono<GuestDTO> getGuest(@PathVariable("guestId") UUID guestId) {
        return guestService.getGuest(guestId)
                .map(guestMapper::daoToDTO);
    }

    @GetMapping
    public Flux<GuestDTO> getAllGuestByEventID(@RequestParam("event") String eventId) {
        return guestService.findAllByEventId(eventId)
                .map(guestMapper::daoToDTO);
    }

    @PostMapping
    public Mono<GuestDTO> createGuest(@RequestBody CreateGuestDTO createGuestDTO) {
        return guestService.createGuest(createGuestDTO)
                .map(guestMapper::daoToDTO);
    }

    @PutMapping("/{guestId}")
    public Mono<GuestDTO> updateGuest(@RequestBody UpdateGuestDTO updateGuestDTO,
                                      @PathVariable("guestId") String guestId) {
        return guestService.updateGuest(updateGuestDTO, guestId)
                .map(guestMapper::daoToDTO);
    }

    @DeleteMapping("/{guestId}")
    public Mono<GuestDTO> deleteGuest(@PathVariable("guestId") UUID guestId) {
        return guestService.deleteGuest(guestId)
                .map(guestMapper::daoToDTO);
    }
}