package com.example.fittracker.api;

import com.example.fittracker.api.dto.FavoriteEntry;
import com.example.fittracker.api.dto.FoodScanResult;
import com.example.fittracker.model.FavoriteFood;
import com.example.fittracker.repository.FavoriteFoodRepository;
import com.example.fittracker.util.CurrentUser;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteFoodRepository repo;

    public FavoriteController(FavoriteFoodRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<FavoriteEntry> list(@AuthenticationPrincipal OAuth2User principal) {
        String email = CurrentUser.emailOrThrow(principal);
        return repo.findByOwnerEmailOrderByCreatedAtDesc(email)
            .stream()
            .map(FavoriteEntry::fromEntity)
            .toList();
    }

    @PostMapping
    public FavoriteEntry add(
        @RequestBody FoodScanResult body,
        @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = CurrentUser.emailOrThrow(principal);
        FavoriteFood saved = repo.save(new FavoriteFood(email, body));
        return FavoriteEntry.fromEntity(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(
        @PathVariable Long id,
        @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = CurrentUser.emailOrThrow(principal);
        return repo.findById(id)
            .filter(f -> email.equalsIgnoreCase(f.getOwnerEmail()))
            .map(f -> {
                repo.delete(f);
                return ResponseEntity.noContent().<Void>build();
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
