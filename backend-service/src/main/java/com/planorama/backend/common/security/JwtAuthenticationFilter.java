package com.planorama.backend.common.security;

import com.planorama.backend.common.JWTUtil;
import com.planorama.backend.event.api.EventAPI;
import com.planorama.backend.event.api.EventDTO;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@Order(1)
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;
    private final EventAPI eventAPI;

    public JwtAuthenticationFilter(JWTUtil jwtUtil,
                                   EventAPI eventAPI) {
        this.jwtUtil = jwtUtil;
        this.eventAPI = eventAPI;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String token = request.getHeader("authorization");
        if (token != null) {
            try {
                final String userId = jwtUtil.verifyToken(Arrays.stream(token.split(" ")).toList().getLast());
                request.setAttribute("userID", userId);
                final List<UUID> ownedEventIds = eventAPI.getAllEvents(userId).stream().map(EventDTO::id).toList();
                final UsernamePasswordAuthenticationToken auth = UsernamePasswordAuthenticationToken.authenticated(userId, null, ownedEventIds.stream().map(EventGrantedAuthority::new).collect(Collectors.toSet()));

                SecurityContextHolder.getContext().setAuthentication(
                        auth);
            } catch (Exception e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}