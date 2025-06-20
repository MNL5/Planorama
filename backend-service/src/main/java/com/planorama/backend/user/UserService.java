package com.planorama.backend.user;

import com.planorama.backend.common.security.JWTUtil;
import com.planorama.backend.common.exceptions.EntityNotFoundException;
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
                .switchIfEmpty(Mono.error(new EntityNotFoundException("email / password is incorrect")))
                .flatMap(user -> {
                    final String refreshToken = createToken(user.id(), refreshExpirationTime);
                    final Update pushNewRefreshTokenUpdate = new Update().push("refreshTokens").value(refreshToken);
                    return reactiveMongoTemplate.findAndModify(findUser, pushNewRefreshTokenUpdate, UserDAO.class)
                            .onErrorResume(error -> Mono.error(new RuntimeException("Failed to update user", error)))
                            .map(updatedUser -> new UserAccess(updatedUser, createToken(updatedUser.id(), expirationTime), refreshToken));
                });
    }


    public Mono<String> logout(String refreshToken) {
        final UUID id = UUID.fromString(jwtUtil.verifyToken(refreshToken));
        final Instant currentTime = Instant.now();
        return findUserByID(id)
                .filter(user -> user.refreshTokens().contains(refreshToken))
                .switchIfEmpty(Mono.error(new RuntimeException("User already has been logout")))
                .flatMap(user -> {
                    final Set<String> updatedTokens = filterExpireTokens(user.refreshTokens().stream(), currentTime, Set.of(refreshToken));
                    return reactiveMongoTemplate.findAndModify(findByIdQuery(id), replaceRefreshTokenUpdate(updatedTokens), UserDAO.class)
                            .onErrorResume(error -> Mono.error(new RuntimeException("Failed to logout user", error)))
                            .map(updatedUser -> "Successfully log out user");
                });
    }

    public Mono<UserAccess> refreshToken(String refreshToken) {
        final UUID id = UUID.fromString(jwtUtil.verifyToken(refreshToken));
        final Instant currentTime = Instant.now();
        return findUserByID(id)
                .filter(user -> user.refreshTokens().contains(refreshToken))
                .switchIfEmpty(Mono.error(new RuntimeException("Token already has been used")))
                .flatMap(user -> {
                    final String newRefreshToken = createToken(id, refreshExpirationTime);
                    final Set<String> updatedTokens = filterExpireTokens(Stream.concat(user.refreshTokens().stream(), Set.of(newRefreshToken).stream()),
                            currentTime,
                            Set.of(refreshToken));
                    return reactiveMongoTemplate.findAndModify(findByIdQuery(id), replaceRefreshTokenUpdate(updatedTokens), UserDAO.class)
                            .onErrorResume(error -> Mono.error(new RuntimeException("Failed to update user", error)))
                            .map(updatedUser -> new UserAccess(updatedUser,
                                    createToken(updatedUser.id(), expirationTime),
                                    newRefreshToken)
                            );
                });
    }

    private Query findByIdQuery(UUID id) {
        return Query.query(where("id").is(id));
    }

    private Update replaceRefreshTokenUpdate(Set<String> updatedTokens) {
        return new Update()
                .set("refreshTokens", updatedTokens);
    }

    private Set<String> filterExpireTokens(Stream<String> tokens, Instant timeLimit, Set<String> usedTokens) {
        return tokens
                .filter(t -> timeLimit.isBefore(jwtUtil.getExpireTime(t)))
                .filter(t -> !usedTokens.contains(t))
                .collect(Collectors.toSet());
    }

    private Mono<UserDAO> findUserByID(UUID id) {
        return reactiveMongoTemplate.findById(id, UserDAO.class)
                .switchIfEmpty(Mono.error(new EntityNotFoundException("User is not exist")));
    }

    private String createToken(UUID id, Duration expirationTime) {
        return jwtUtil.generateToken(id, expirationTime);
    }
}