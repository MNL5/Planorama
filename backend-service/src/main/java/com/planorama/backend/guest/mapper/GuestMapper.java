package com.planorama.backend.guest.mapper;

import com.planorama.backend.guest.api.*;
import com.planorama.backend.guest.entity.GuestDAO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface GuestMapper {
    @Mapping(source = "status", target = "status", qualifiedByName = "statusToDTO")
    @Mapping(source = "meal", target = "meal", qualifiedByName = "mealToDTO")
    GuestDTO daoToDTO(GuestDAO guestDAO);

    UpdateGuestDTO extendUpdate(UpdateRsvpGuestDTO guestDTO);

    @Named("statusToDTO")
    default RSVPStatusDTO statusToDTO(String status) {
        return status != null ? RSVPStatusDTO.valueOf(status) : null;
    }

    @Named("mealToDTO")
    default Set<MealDTO> mealToDTO(Set<String> meal) {
        return meal != null ? meal.stream().map(MealDTO::valueOf).collect(Collectors.toSet()) : null;
    }
}