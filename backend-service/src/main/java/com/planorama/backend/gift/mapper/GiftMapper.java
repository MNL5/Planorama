package com.planorama.backend.gift.mapper;

import com.planorama.backend.gift.api.GiftDTO;
import com.planorama.backend.gift.entity.GiftDAO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GiftMapper {
    GiftDTO daoToDTO(GiftDAO giftDAO);
}