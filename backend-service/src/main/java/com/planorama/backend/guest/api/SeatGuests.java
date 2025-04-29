package com.planorama.backend.guest.api;

import org.springframework.context.ApplicationEvent;

import java.util.Set;
import java.util.UUID;

public class SeatGuests extends ApplicationEvent {
    private final Set<UUID> guestIds;
    private final String tableId;

    public SeatGuests(Object source,
                      Set<UUID> guestId,
                      String tableId) {
        super(source);
        this.guestIds = guestId;
        this.tableId = tableId;
    }

    public Set<UUID> getGuestIds() {
        return guestIds;
    }

    public String getTableId() {
        return tableId;
    }
}