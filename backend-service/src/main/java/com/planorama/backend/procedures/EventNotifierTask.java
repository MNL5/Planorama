package com.planorama.backend.procedures;

import com.planorama.backend.event.api.EventAPI;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

import java.time.OffsetDateTime;

@Component
public class EventNotifierTask implements Runnable {
    private final EventAPI eventAPI;

    public EventNotifierTask(EventAPI eventAPI) {
        this.eventAPI = eventAPI;
    }

    @Override
    public void run() {
        final OffsetDateTime now = OffsetDateTime.now();
        final OffsetDateTime weekFromNow = now.plusWeeks(1);
        OffsetDateTime monthFromNow = now.plusMonths(1);
        Flux.merge(eventAPI.getEventBetweenDates(now, now.plusDays(1)),
                        eventAPI.getEventBetweenDates(weekFromNow, weekFromNow.plusDays(1)),
                        eventAPI.getEventBetweenDates(monthFromNow, monthFromNow.plusDays(1)))
                .doOnNext(event -> {
                    // TODO: send notification
                })
                .subscribe();
    }
}