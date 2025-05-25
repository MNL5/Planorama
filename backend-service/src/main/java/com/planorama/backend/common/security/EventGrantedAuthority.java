package com.planorama.backend.common.security;

import org.springframework.security.core.GrantedAuthority;

import java.util.UUID;

public record EventGrantedAuthority(UUID eventId) implements GrantedAuthority {
    @Override
    public String getAuthority() {
        return eventId.toString();
    }
}