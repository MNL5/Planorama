package com.planorama.backend.guest.api;

import com.planorama.backend.common.EventEntityAPI;

import java.util.List;
import java.util.Set;

public interface GuestAPI extends EventEntityAPI<GuestDTO> {
    List<GuestDTO> getAllGuestByEventID(String eventId);

    List<GuestDTO> getAllGuestsByEventIDAndRsvpStatus(String eventId, Set<RSVPStatusDTO> rsvpStatus);
}