package com.planorama.backend.user;

import com.planorama.backend.common.JWTUtil;
import com.planorama.backend.user.api.CreateUserAction;
import com.planorama.backend.user.entity.UserAccess;
import com.planorama.backend.user.entity.UserDAO;
import com.planorama.backend.user.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.springframework.data.mongodb.core.query.Criteria.where;

@Service
public class UserService {
    private final ReactiveMongoTemplate reactiveMongoTemplate;
    private final PasswordUtil passwordUtil;
    private final JWTUtil jwtUtil;
    private final Duration expirationTime;
    private final Duration refreshExpirationTime;


    public UserService(ReactiveMongoTemplate reactiveMongoTemplate,
                       PasswordUtil passwordUtil,
                       JWTUtil jwtUtil,
                       @Qualifier("expireTime") Duration expirationTime,
                       @Qualifier("refreshExpireTime") Duration refreshExpirationTime) {
        this.reactiveMongoTemplate = reactiveMongoTemplate;
        this.passwordUtil = passwordUtil;
        this.jwtUtil = jwtUtil;
        this.expirationTime = expirationTime;
        this.refreshExpirationTime = refreshExpirationTime;
    }

    public Mono<UserAccess> createUser(CreateUserAction createUserAction) {
        UserDAO newUser = convertCreateActionToUser(createUserAction);
        return reactiveMongoTemplate.save(newUser)
                .map(user -> new UserAccess(user,
                        createToken(user.id(), expirationTime),
                        user.refreshTokens().stream().findAny().orElseThrow(() -> new RuntimeException("Create User without Refresh Token"))));
    }

    private UserDAO convertCreateActionToUser(CreateUserAction createUserAction) {
        UUID id = UUID.randomUUID();
        return new UserDAO(id,
                createUserAction.email(),
                passwordUtil.hashPassword(createUserAction.password()),
                Set.of(createToken(id, refreshExpirationTime)));
    }

    public Mono<UserAccess> logicUser(String email, String password) {
        final Query findUser = Query.query(where("email").is(email));
        return reactiveMongoTemplate.findOne(findUser, UserDAO.class)
                .filter(user -> passwordUtil.verifyPassword(password, user.password()))
                .switchIfEmpty(Mono.error(new RuntimeException("email / password is incorrect")))
                .flatMap(user -> {
                    final String refreshToken = createToken(user.id(), refreshExpirationTime);
                    final Update pushNewRefreshTokenUpdate = new Update().push("refreshTokens").value(refreshToken);
                    return reactiveMongoTemplate.findAndModify(findUser, pushNewRefreshTokenUpdate, UserDAO.class)
                            .switchIfEmpty(Mono.error(new RuntimeException("Failed to update user")))
                            .map(updatedUser -> new UserAccess(updatedUser, createToken(updatedUser.id(), expirationTime), refreshToken));
                });
    }

    public Mono<UserAccess> refreshToken(String refreshToken) {
        final UUID id = UUID.fromString(jwtUtil.verifyToken(refreshToken));
        final Instant currentTime = Instant.now();
        final Query findUser = Query.query(where("id").is(id));
        return reactiveMongoTemplate.findById(id, UserDAO.class)
                .switchIfEmpty(Mono.error(new RuntimeException("user is not exist")))
                .flatMap(user -> {
                    final String newRefreshToken = createToken(id, refreshExpirationTime);
                    final Set<String> updatedTokens = Stream.concat(user.refreshTokens().stream(), Set.of(newRefreshToken).stream())
                            .filter(t -> currentTime.isBefore(jwtUtil.getExpireTime(t)))
                            .filter(t -> !t.equals(refreshToken))
                            .collect(Collectors.toSet());
                    final Update pushNewRefreshTokenUpdate = new Update()
                            .set("refreshTokens", updatedTokens);
                    return reactiveMongoTemplate.findAndModify(findUser, pushNewRefreshTokenUpdate, UserDAO.class)
                            .switchIfEmpty(Mono.error(new RuntimeException("Failed to update user")))
                            .map(updatedUser -> new UserAccess(updatedUser,
                                    createToken(updatedUser.id(), expirationTime),
                                    newRefreshToken)
                            );
                });
    }

    private String createToken(UUID id, Duration expirationTime) {
        return jwtUtil.generateToken(id, expirationTime);
    }
}