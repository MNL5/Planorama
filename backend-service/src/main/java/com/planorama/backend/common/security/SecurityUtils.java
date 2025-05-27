package com.planorama.backend.common.security;

import com.planorama.backend.common.EventEntity;
import com.planorama.backend.common.EventEntityAPI;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Component("securityUtils")
public class SecurityUtils {
    private final Map<String, EventEntityAPI<?>> eventEntityAPIMap;

    public SecurityUtils(Map<String, EventEntityAPI<?>> eventEntityAPIMap) {
        this.eventEntityAPIMap = eventEntityAPIMap;
    }

    public boolean canAccessEntity(String entityType, UUID entityId, Authentication authentication) {
        if (!eventEntityAPIMap.containsKey(entityType)) {
            return false;
        }

        return Optional.ofNullable(eventEntityAPIMap.get(entityType).findById(entityId))
                .map(EventEntity::getEventId)
                .map(eventId -> authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .anyMatch(authority -> authority.equals(eventId)))
                .orElse(false);
    }
}