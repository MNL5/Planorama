package com.planorama.backend.common;

import com.planorama.backend.event.api.EventAPI;
import com.planorama.backend.event.api.EventDTO;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.Set;

@Component
@Order(1)
public class JwtAuthenticationFilter implements Filter {
    private final JWTUtil jwtUtil;
    private final EventAPI eventAPI;
    private final Set<String> permitRoutes;

    public JwtAuthenticationFilter(JWTUtil jwtUtil,
                                   EventAPI eventAPI,
                                   @Qualifier("permitRoutes") Set<String> permitRoutes) {
        this.jwtUtil = jwtUtil;
        this.eventAPI = eventAPI;
        this.permitRoutes = permitRoutes;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest httpRequest = ((HttpServletRequest) request);
        for (String permitRoute : permitRoutes) {
            if (httpRequest.getRequestURI().startsWith(permitRoute)) {
                filterChain.doFilter(request, response);
                return;
            }
        }

        if (HttpMethod.OPTIONS.matches(httpRequest.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = httpRequest.getHeader("authorization");
        if (token == null || token.isEmpty()) {
            ((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing token");
            return;
        }

        try {
            String userId = jwtUtil.verifyToken(Arrays.stream(token.split(" ")).toList().getLast());
            httpRequest.setAttribute("userID", userId);
            httpRequest.setAttribute("eventIDs", eventAPI.getAllEvents(userId).map(EventDTO::id).collectList().block());
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            ((HttpServletResponse) response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
        }
    }
}
