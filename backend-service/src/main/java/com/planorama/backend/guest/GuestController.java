package com.planorama.backend.guest;

import com.planorama.backend.common.EventEntityAPI;
import com.planorama.backend.guest.api.*;
import com.planorama.backend.guest.mapper.GuestMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController("guests")
@RequestMapping("guests")
public class GuestController implements GuestAPI, EventEntityAPI<GuestDTO> {
    private final GuestService guestService;
    private final GuestMapper guestMapper;

    public GuestController(GuestService guestService, GuestMapper guestMapper) {
        this.guestService = guestService;
        this.guestMapper = guestMapper;
    }

    @GetMapping("/{guestId}")
    @PreAuthorize("@securityUtils.canAccessEntity('guests', #guestId, authentication)")
    public GuestDTO getGuest(@PathVariable("guestId") UUID guestId) {
        return findById(guestId);
    }

    @Override
    public GuestDTO findById(UUID id) {
        return guestService.getGuest(id)
                .map(guestMapper::daoToDTO)
                .block();
    }

    @GetMapping
    @Override
    @PreAuthorize("hasAuthority(#eventId)")
    public List<GuestDTO> getAllGuestByEventID(@RequestParam("event") String eventId) {
        return guestService.findAllByEventId(eventId)
                .map(guestMapper::daoToDTO)
                .collectList()
                .block();
    }

    @GetMapping("/byTable")
    @PreAuthorize("hasAuthority(#eventId)")
    public List<GuestDTO> getAllGuestByEventIdAndTableId(@RequestParam("event") String eventId,
                                                         @RequestParam("table") String tableId) {
        return guestService.findAllByEventIdAndTableId(eventId, tableId)
                .map(guestMapper::daoToDTO)
                .collectList()
                .block();
    }

    @Override
    public List<GuestDTO> getAllGuestsByEventIDAndRsvpStatus(String eventId, Set<RSVPStatusDTO> rsvpStatus) {
        return guestService.findAllByEventIdAndRsvpStatus(eventId, rsvpStatus)
                .map(guestMapper::daoToDTO)
                .collectList()
                .block();
    }

    @PostMapping
    @PreAuthorize("hasAuthority(#createGuestDTO.eventId)")
    public GuestDTO createGuest(@RequestBody CreateGuestDTO createGuestDTO) {
        return guestService.createGuest(createGuestDTO)
                .map(guestMapper::daoToDTO)
                .block();
    }

    @PutMapping
    @PreAuthorize("hasAuthority(#guestsUpdateDTO.eventId)")
    public String updateGuests(@RequestBody GuestsUpdateDTO guestsUpdateDTO) {
        return guestService.updateGuests(guestsUpdateDTO)
                .filter(result -> result.getMatchedCount() == guestsUpdateDTO.guests().size())
                .map(result -> String.format("Updated %d guests", result.getModifiedCount()))
                .switchIfEmpty(Mono.error(new RuntimeException(String.format("Failed to update %d guests", guestsUpdateDTO.guests().size()))))
                .block();
    }

    @PutMapping("/{guestId}")
    @PreAuthorize("@securityUtils.canAccessEntity('guests', #guestId, authentication)")
    public GuestDTO updateGuest(@RequestBody UpdateGuestDTO updateGuestDTO,
                                @PathVariable("guestId") UUID guestId) {
        return guestService.updateGuest(updateGuestDTO, guestId)
                .map(guestMapper::daoToDTO)
                .block();
    }

    @PutMapping("/rsvp/{guestId}")
    public GuestDTO updateGuestRSVP(@RequestBody UpdateRsvpGuestDTO updateRsvpGuestDTO,
                                    @PathVariable("guestId") UUID guestId) {
        return guestService.updateGuest(guestMapper.extendUpdate(updateRsvpGuestDTO), guestId)
                .map(guestMapper::daoToDTO)
                .block();
    }

    @DeleteMapping("/{guestId}")
    @PreAuthorize("@securityUtils.canAccessEntity('guests', #guestId, authentication)")
    public GuestDTO deleteGuest(@PathVariable("guestId") UUID guestId) {
        return guestService.deleteGuest(guestId)
                .map(guestMapper::daoToDTO)
                .block();
    }
}