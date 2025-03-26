package com.planorama.backend.user;

import com.planorama.backend.user.api.CreateUserAction;
import com.planorama.backend.user.entity.RefreshToken;
import com.planorama.backend.user.entity.UserAccess;
import com.planorama.backend.user.entity.UserDAO;
import com.planorama.backend.user.util.JWTUtil;
import com.planorama.backend.user.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.Date;
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
    private final Duration refreshTokenExpire;

    public UserService(ReactiveMongoTemplate reactiveMongoTemplate,
                       PasswordUtil passwordUtil,
                       JWTUtil jwtUtil,
                       @Qualifier("refreshExpireTime") Duration refreshTokenExpire) {
        this.reactiveMongoTemplate = reactiveMongoTemplate;
        this.passwordUtil = passwordUtil;
        this.jwtUtil = jwtUtil;
        this.refreshTokenExpire = refreshTokenExpire;
    }

    public Mono<UserAccess> createUser(CreateUserAction createUserAction) {
        UserDAO newUser = convertCreateActionToUser(createUserAction);
        return reactiveMongoTemplate.save(newUser)
                .map(user -> new UserAccess(user,
                        jwtUtil.generateToken(user.email()),
                        user.refreshTokens().stream().findAny().orElseThrow(() -> new RuntimeException("Create User without Refresh Token"))));
    }

    private UserDAO convertCreateActionToUser(CreateUserAction createUserAction) {
        return new UserDAO(UUID.randomUUID(),
                createUserAction.email(),
                passwordUtil.hashPassword(createUserAction.password()),
                Set.of(createRefreshToken()));
    }

    public Mono<UserAccess> logicUser(String email, String password) {
        final Query findUser = Query.query(where("email").is(email));
        return reactiveMongoTemplate.findOne(findUser, UserDAO.class)
                .filter(user -> passwordUtil.verifyPassword(password, user.password()))
                .switchIfEmpty(Mono.error(new RuntimeException("email / password is incorrect")))
                .flatMap(user -> {
                    final RefreshToken refreshToken = createRefreshToken();
                    final Update pushNewRefreshTokenUpdate = new Update().push("refreshTokens").value(refreshToken);
                    return reactiveMongoTemplate.findAndModify(findUser, pushNewRefreshTokenUpdate, UserDAO.class)
                            .switchIfEmpty(Mono.error(new RuntimeException("Failed to update user")))
                            .map(updatedUser -> new UserAccess(updatedUser, jwtUtil.generateToken(updatedUser.email()), refreshToken));
                });
    }

    public Mono<UserAccess> refreshToken(UUID id, UUID refreshToken) {
        final Query findUser = Query.query(where("id").is(id));
        return reactiveMongoTemplate.findById(id, UserDAO.class)
                .switchIfEmpty(Mono.error(new RuntimeException("user is not exist")))
                .flatMap(user -> {
                    if (user.refreshTokens()
                            .stream()
                            .noneMatch(token -> refreshToken.equals(token.value()) &&
                                    token.expireTimeEpochMillis() - OffsetDateTime.now().toInstant().toEpochMilli() > 0)) {
                        throw new RuntimeException("Missing Refresh token");
                    }
                    final RefreshToken newRefreshToken = createRefreshToken();
                    final Set<RefreshToken> updatedTokens = Stream.concat(user.refreshTokens().stream(), Set.of(newRefreshToken).stream())
                            .filter(token -> !refreshToken.equals(token.value()))
                            .collect(Collectors.toSet());
                    final Update pushNewRefreshTokenUpdate = new Update()
                            .set("refreshTokens", updatedTokens);
                    return reactiveMongoTemplate.findAndModify(findUser, pushNewRefreshTokenUpdate, UserDAO.class)
                            .switchIfEmpty(Mono.error(new RuntimeException("Failed to update user")))
                            .map(updatedUser -> new UserAccess(updatedUser,
                                    jwtUtil.generateToken(updatedUser.email()),
                                    newRefreshToken)
                            );
                });
    }

    private RefreshToken createRefreshToken() {
        return new RefreshToken(UUID.randomUUID(), new Date().toInstant().plus(refreshTokenExpire).toEpochMilli());
    }
}