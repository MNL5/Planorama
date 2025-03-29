package com.planorama.backend.user;

import com.planorama.backend.user.api.CreateUserAction;
import com.planorama.backend.user.entity.UserAccess;
import com.planorama.backend.user.entity.UserDAO;
import com.planorama.backend.user.util.JWTUtil;
import com.planorama.backend.user.util.PasswordUtil;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

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

    public UserService(ReactiveMongoTemplate reactiveMongoTemplate,
                       PasswordUtil passwordUtil,
                       JWTUtil jwtUtil) {
        this.reactiveMongoTemplate = reactiveMongoTemplate;
        this.passwordUtil = passwordUtil;
        this.jwtUtil = jwtUtil;
    }

    public Mono<UserAccess> createUser(CreateUserAction createUserAction) {
        UserDAO newUser = convertCreateActionToUser(createUserAction);
        return reactiveMongoTemplate.save(newUser)
                .map(user -> new UserAccess(user,
                        createToken(user.id()),
                        user.refreshTokens().stream().findAny().orElseThrow(() -> new RuntimeException("Create User without Refresh Token"))));
    }

    private UserDAO convertCreateActionToUser(CreateUserAction createUserAction) {
        UUID id = UUID.randomUUID();
        return new UserDAO(id,
                createUserAction.email(),
                passwordUtil.hashPassword(createUserAction.password()),
                Set.of(createToken(id)));
    }

    public Mono<UserAccess> logicUser(String email, String password) {
        final Query findUser = Query.query(where("email").is(email));
        return reactiveMongoTemplate.findOne(findUser, UserDAO.class)
                .filter(user -> passwordUtil.verifyPassword(password, user.password()))
                .switchIfEmpty(Mono.error(new RuntimeException("email / password is incorrect")))
                .flatMap(user -> {
                    final String refreshToken = createToken(user.id());
                    final Update pushNewRefreshTokenUpdate = new Update().push("refreshTokens").value(refreshToken);
                    return reactiveMongoTemplate.findAndModify(findUser, pushNewRefreshTokenUpdate, UserDAO.class)
                            .switchIfEmpty(Mono.error(new RuntimeException("Failed to update user")))
                            .map(updatedUser -> new UserAccess(updatedUser, createToken(updatedUser.id()), refreshToken));
                });
    }


    public Mono<String> logout(String refreshToken) {
        final UUID id = UUID.fromString(jwtUtil.verifyToken(refreshToken));
        final Instant currentTime = Instant.now();
        return findUserByID(id)
                .flatMap(user -> {
                    final Set<String> updatedTokens = filterExpireTokens(user.refreshTokens().stream(), currentTime, Set.of(refreshToken));
                    return reactiveMongoTemplate.findAndModify(findByIdQuery(id), replaceRefreshTokenUpdate(updatedTokens), UserDAO.class)
                            .switchIfEmpty(Mono.error(new RuntimeException("Failed to logout user")))
                            .map(updatedUser -> "Successfully log out user");
                });
    }

    public Mono<UserAccess> refreshToken(String refreshToken) {
        final UUID id = UUID.fromString(jwtUtil.verifyToken(refreshToken));
        final Instant currentTime = Instant.now();
        return findUserByID(id)
                .flatMap(user -> {
                    final String newRefreshToken = createToken(id);
                    final Set<String> updatedTokens = filterExpireTokens(Stream.concat(user.refreshTokens().stream(), Set.of(newRefreshToken).stream()),
                            currentTime,
                            Set.of(refreshToken));
                    return reactiveMongoTemplate.findAndModify(findByIdQuery(id), replaceRefreshTokenUpdate(updatedTokens), UserDAO.class)
                            .switchIfEmpty(Mono.error(new RuntimeException("Failed to update user")))
                            .map(updatedUser -> new UserAccess(updatedUser,
                                    createToken(updatedUser.id()),
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
                .switchIfEmpty(Mono.error(new RuntimeException("user is not exist")));
    }

    private String createToken(UUID id) {
        return jwtUtil.generateToken(id);
    }
}