package com.example.fittracker.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Sliding-window rate limiter for the scan endpoints.
 * Caps each caller at {@value #LIMIT_PER_WINDOW} scans per {@value #WINDOW_MS} ms window.
 * Fly.io injects the real caller IP on the Fly-Client-IP header; fall back to X-Forwarded-For,
 * then to the socket's remote address.
 */
@Component
public class ScanRateLimitInterceptor implements HandlerInterceptor {

    private static final Logger log = LoggerFactory.getLogger(ScanRateLimitInterceptor.class);
    private static final int LIMIT_PER_WINDOW = 30;
    private static final long WINDOW_MS = 60L * 60L * 1000L; // 1 hour

    private final Map<String, Window> windows = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
        throws IOException {
        String key = clientKey(request);
        long now = System.currentTimeMillis();

        Window current = windows.compute(key, (k, prev) -> {
            if (prev == null || now - prev.startMs >= WINDOW_MS) {
                return new Window(now, 1);
            }
            return new Window(prev.startMs, prev.count + 1);
        });

        log.info("scan-rl path={} ip={} count={}/{}", request.getRequestURI(), key, current.count, LIMIT_PER_WINDOW);

        if (current.count > LIMIT_PER_WINDOW) {
            long retryAfterSec = Math.max(1, (current.startMs + WINDOW_MS - now) / 1000);
            response.setStatus(429);
            response.setHeader("Retry-After", Long.toString(retryAfterSec));
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"rate_limited\"}");
            return false;
        }
        return true;
    }

    private String clientKey(HttpServletRequest req) {
        String flyIp = req.getHeader("Fly-Client-IP");
        if (flyIp != null && !flyIp.isBlank()) return flyIp.trim();

        String xff = req.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            int comma = xff.indexOf(',');
            return (comma > 0 ? xff.substring(0, comma) : xff).trim();
        }
        return req.getRemoteAddr();
    }

    private record Window(long startMs, int count) {}
}
