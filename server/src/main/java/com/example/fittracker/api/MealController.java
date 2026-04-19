package com.example.fittracker.api;

import com.example.fittracker.api.dto.FoodScanResult;
import com.example.fittracker.api.dto.MealEntry;
import com.example.fittracker.model.Meal;
import com.example.fittracker.repository.MealRepository;
import com.example.fittracker.service.NutritionScoringService;
import com.example.fittracker.service.NutritionScoringService.Scores;
import com.example.fittracker.util.CurrentUser;
import com.example.fittracker.util.DayRange;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@RestController
@RequestMapping("/api/meals")
public class MealController {

    private final MealRepository repo;
    private final NutritionScoringService scoring;

    public MealController(MealRepository repo, NutritionScoringService scoring) {
        this.repo = repo;
        this.scoring = scoring;
    }

    @PostMapping
    public MealEntry saveMeal(
        @RequestBody FoodScanResult scanResult,
        @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = CurrentUser.emailOrThrow(principal);
        Scores s = scoring.score(scanResult);
        Meal saved = repo.save(new Meal(scanResult, s.nutrientScore(), s.pollutantScore(), email));
        return MealEntry.fromEntity(saved);
    }

    @GetMapping("/today")
    public List<MealEntry> getTodayMeals(
        @RequestParam(value = "tz", required = false) String tz,
        @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = CurrentUser.emailOrThrow(principal);
        DayRange range = DayRange.todayIn(tz);
        return repo
            .findByOwnerEmailAndCreatedAtBetweenOrderByCreatedAtDesc(email, range.startUtc(), range.endUtc())
            .stream()
            .map(MealEntry::fromEntity)
            .toList();
    }

    @GetMapping
    public List<MealEntry> getRecentMeals(
        @RequestParam(value = "days", required = false, defaultValue = "30") int days,
        @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = CurrentUser.emailOrThrow(principal);
        int safeDays = Math.max(1, Math.min(365, days));
        LocalDateTime after = LocalDateTime.now(ZoneOffset.UTC).minusDays(safeDays);
        return repo
            .findTop200ByOwnerEmailAndCreatedAtAfterOrderByCreatedAtDesc(email, after)
            .stream()
            .map(MealEntry::fromEntity)
            .toList();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeal(
        @PathVariable Long id,
        @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = CurrentUser.emailOrThrow(principal);
        return repo.findById(id)
            .filter(m -> email.equalsIgnoreCase(m.getOwnerEmail()))
            .map(m -> {
                repo.delete(m);
                return ResponseEntity.noContent().<Void>build();
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
