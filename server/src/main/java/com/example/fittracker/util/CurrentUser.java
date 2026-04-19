package com.example.fittracker.util;

import org.springframework.security.oauth2.core.user.OAuth2User;

public final class CurrentUser {

    private CurrentUser() {}

    public static String emailOrThrow(OAuth2User principal) {
        if (principal == null) {
            throw new IllegalStateException("No authenticated principal");
        }
        Object email = principal.getAttributes().get("email");
        if (!(email instanceof String s) || s.isBlank()) {
            throw new IllegalStateException("Principal has no email attribute");
        }
        return s.toLowerCase();
    }
}
