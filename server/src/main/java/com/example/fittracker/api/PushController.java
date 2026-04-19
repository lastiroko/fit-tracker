package com.example.fittracker.api;

import com.example.fittracker.api.dto.PushSubscriptionRequest;
import com.example.fittracker.config.PushConfig;
import com.example.fittracker.model.PushSubscriptionEntity;
import com.example.fittracker.repository.PushSubscriptionRepository;
import com.example.fittracker.util.CurrentUser;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/push")
public class PushController {

    private final PushSubscriptionRepository repo;
    private final PushConfig pushConfig;

    public PushController(PushSubscriptionRepository repo, PushConfig pushConfig) {
        this.repo = repo;
        this.pushConfig = pushConfig;
    }

    @GetMapping("/vapid-public-key")
    public Map<String, String> vapidPublicKey() {
        return Map.of("publicKey", pushConfig.getPublicKey(), "configured", String.valueOf(pushConfig.isConfigured()));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(
        @RequestBody PushSubscriptionRequest body,
        @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = CurrentUser.emailOrThrow(principal);
        if (body == null || body.endpoint() == null || body.keys() == null) {
            return ResponseEntity.badRequest().build();
        }
        repo.findByOwnerEmailAndEndpoint(email, body.endpoint())
            .ifPresentOrElse(existing -> {}, () ->
                repo.save(new PushSubscriptionEntity(
                    email, body.endpoint(),
                    body.keys().p256dh(), body.keys().auth()
                ))
            );
        return ResponseEntity.noContent().build();
    }

    @Transactional
    @DeleteMapping("/subscribe")
    public ResponseEntity<Void> unsubscribe(
        @RequestParam("endpoint") String endpoint,
        @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = CurrentUser.emailOrThrow(principal);
        repo.deleteByOwnerEmailAndEndpoint(email, endpoint);
        return ResponseEntity.noContent().build();
    }
}
