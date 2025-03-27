package com.planorama.backend.user.mapper;

import com.planorama.backend.user.api.LoginUserDTO;
import com.planorama.backend.user.entity.UserDAO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", source = "user.id")
    @Mapping(target = "refreshToken", source = "refreshToken")
    @Mapping(target = "accessToken", source = "accessToken")
    LoginUserDTO daoWithTokensToLoginDto(UserDAO user, String accessToken, String refreshToken);
}
