package com.example.fittracker.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        Map<String, Object> out = new HashMap<>();
        out.put("email", principal.getAttributes().get("email"));
        out.put("name", principal.getAttributes().get("name"));
        out.put("picture", principal.getAttributes().get("picture"));
        return ResponseEntity.ok(out);
    }
}
