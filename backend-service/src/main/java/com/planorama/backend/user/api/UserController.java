package com.planorama.backend.user.api;

import com.planorama.backend.user.UserService;
import com.planorama.backend.user.mapper.UserMapper;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @PostMapping
    public LoginUserDTO createUser(@RequestBody @Valid CreateUserAction createUserAction) {
        return userService.createUser(createUserAction)
                .map(user -> userMapper.daoWithTokensToLoginDto(user.userDAO(), user.accessToken(), user.refreshToken()))
                .onErrorResume(Mono::error)
                .block();
    }

    @PostMapping("/login")
    public LoginUserDTO login(@RequestBody @Valid LoginUserAction loginUserAction) {
        return userService.logicUser(loginUserAction.email(), loginUserAction.password())
                .map(user -> userMapper.daoWithTokensToLoginDto(user.userDAO(), user.accessToken(), user.refreshToken()))
                .onErrorResume(Mono::error)
                .block();
    }

    @PostMapping("/logout")
    public String logout(@RequestBody @Valid RefreshTokenAction refreshTokenAction) {
        return userService.logout(refreshTokenAction.refreshToken())
                .onErrorResume(Mono::error)
                .block();
    }

    @PostMapping("/refresh")
    public LoginUserDTO refresh(@RequestBody @Valid RefreshTokenAction refreshTokenAction) {
        return userService.refreshToken(refreshTokenAction.refreshToken())
                .map(user -> userMapper.daoWithTokensToLoginDto(user.userDAO(), user.accessToken(), user.refreshToken()))
                .onErrorResume(Mono::error)
                .block();
    }
}