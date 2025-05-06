package com.planorama.backend.procedures;

import com.planorama.backend.common.MessagingUtil;
import com.planorama.backend.event.api.DiagramTableDTO;
import com.planorama.backend.event.api.EventAPI;
import com.planorama.backend.guest.api.GuestAPI;
import com.planorama.backend.guest.api.RSVPStatusDTO;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class EventNotifierTask implements Runnable {
    private final EventAPI eventAPI;
    private final GuestAPI guestAPI;
    private final MessagingUtil messagingUtil;

    public EventNotifierTask(EventAPI eventAPI,
                             GuestAPI guestAPI,
                             MessagingUtil messagingUtil) {
        this.eventAPI = eventAPI;
        this.guestAPI = guestAPI;
        this.messagingUtil = messagingUtil;
    }

    @Override
    public void run() {
        final OffsetDateTime now = OffsetDateTime.now();
        eventAPI.getEventBetweenDates(now, now.plusDays(1))
                .filter(event -> Objects.nonNull(event.diagram()))
                .flatMap(event -> {
                    final AtomicInteger index = new AtomicInteger(1);
                    final Map<String, Integer> tablesNumberMap = event.diagram().elements().stream()
                            .filter(DiagramTableDTO.class::isInstance)
                            .map(DiagramTableDTO.class::cast)
                            .collect(Collectors.toMap(
                                    DiagramTableDTO::id,
                                    table -> index.getAndIncrement()));
                    return guestAPI.getAllGuestsByEventIDAndRsvpStatus(event.id().toString(), Set.of(RSVPStatusDTO.ACCEPTED))
                            .doOnNext(guest -> messagingUtil.sendReminder(event, guest, tablesNumberMap.getOrDefault(guest.tableId(), 0)));
                })
                .subscribe();
        final OffsetDateTime weekFromNow = now.plusWeeks(1);
        OffsetDateTime monthFromNow = now.plusMonths(1);
        Flux.merge(eventAPI.getEventBetweenDates(weekFromNow, weekFromNow.plusDays(1)),
                        eventAPI.getEventBetweenDates(monthFromNow, monthFromNow.plusDays(1)))
                .flatMap(event ->
                        guestAPI.getAllGuestsByEventIDAndRsvpStatus(event.id().toString(), Set.of(RSVPStatusDTO.TENTATIVE, RSVPStatusDTO.ACCEPTED))
                                .doOnNext(guest -> messagingUtil.sendInvitation(event, guest)))
                .subscribe();
    }
}