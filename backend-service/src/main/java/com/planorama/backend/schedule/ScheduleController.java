package com.planorama.backend.schedule;

import com.planorama.backend.schedule.api.CreateTimeSlotDTO;
import com.planorama.backend.schedule.api.ScheduleDTO;
import com.planorama.backend.schedule.api.UpdateTimeSlotDTO;
import com.planorama.backend.schedule.mapper.ScheduleMapper;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/schedules")
public class ScheduleController {
    private final ScheduleService scheduleService;
    private final ScheduleMapper scheduleMapper;

    public ScheduleController(ScheduleService scheduleService,
                              ScheduleMapper scheduleMapper) {
        this.scheduleService = scheduleService;
        this.scheduleMapper = scheduleMapper;
    }

    @GetMapping
    @PreAuthorize("hasAuthority(#eventId)")
    public ScheduleDTO getSchedulesByEvent(@RequestParam("event") String eventId) {
        return scheduleService.getScheduleByEventId(eventId)
                .map(scheduleMapper::daoToDTO)
                .block();
    }

    @PostMapping
    @PreAuthorize("hasAuthority(#createTimeSlotDTO.eventId)")
    public ScheduleDTO createTimeSlot(@RequestBody CreateTimeSlotDTO createTimeSlotDTO) {
        return scheduleService.upsertSchedule(createTimeSlotDTO)
                .map(scheduleMapper::daoToDTO)
                .block();
    }

    @PutMapping("/{eventId}/{timeSlotId}")
    @PreAuthorize("hasAuthority(#eventId)")
    public ScheduleDTO updateTimeSlot(@PathVariable("eventId") String eventId,
                                      @PathVariable("timeSlotId") UUID timeSlotId,
                                      @RequestBody UpdateTimeSlotDTO updateTimeSlotDTO) {
        return scheduleService.updateTimeSlot(eventId, timeSlotId, updateTimeSlotDTO)
                .map(scheduleMapper::daoToDTO)
                .block();
    }

    @DeleteMapping("/{eventId}/{timeSlotId}")
    @PreAuthorize("hasAuthority(#eventId)")
    public ScheduleDTO deleteTimeSlot(@PathVariable("eventId") String eventId,
                                      @PathVariable("timeSlotId") UUID timeSlotId) {
        return scheduleService.deleteTimeSlot(eventId, timeSlotId)
                .map(scheduleMapper::daoToDTO)
                .block();
    }
}