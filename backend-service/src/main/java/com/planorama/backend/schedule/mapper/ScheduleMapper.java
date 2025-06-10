package com.planorama.backend.schedule.mapper;

import com.planorama.backend.schedule.api.ScheduleDTO;
import com.planorama.backend.schedule.api.TimeSlotDTO;
import com.planorama.backend.schedule.entity.ScheduleDAO;
import com.planorama.backend.schedule.entity.TimeSlotDAO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@Mapper(componentModel = "spring")
public interface ScheduleMapper {
    ScheduleDTO daoToDTO(ScheduleDAO scheduleDAO);

    List<TimeSlotDTO> mapTimeSlots(List<TimeSlotDAO> timeSlots);

    @Mapping(source = "startTime", target = "startTime", qualifiedByName = "epochMillisToOffsetDateTime")
    @Mapping(source = "endTime", target = "endTime", qualifiedByName = "epochMillisToOffsetDateTime")
    TimeSlotDTO mapTimeSlot(TimeSlotDAO timeSlot);

    @Named("epochMillisToOffsetDateTime")
    default OffsetDateTime epochMillisToOffsetDateTime(Long epochMillis) {
        return epochMillis != null ? OffsetDateTime.ofInstant(Instant.ofEpochMilli(epochMillis), ZoneId.systemDefault()) : null;
    }
}