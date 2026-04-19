package com.example.fittracker.api;

import com.example.fittracker.api.dto.PlannedMealEntry;
import com.example.fittracker.api.dto.PlannedMealRequest;
import com.example.fittracker.model.PlannedMeal;
import com.example.fittracker.repository.PlannedMealRepository;
import com.example.fittracker.util.CurrentUser;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/plan")
public class PlanController {

    private static final Set<String> VALID_SLOTS = Set.of("breakfast", "lunch", "dinner", "snack");

    private final PlannedMealRepository repo;

    public PlanController(PlannedMealRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<PlannedMealEntry> range(
        @RequestParam("start") String start,
        @RequestParam("end") String end,
        @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = CurrentUser.emailOrThrow(principal);
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("end must be on or after start");
        }
        return repo.findByOwnerEmailAndDateBetweenOrderByDateAscSlotAsc(email, startDate, endDate)
            .stream()
            .map(PlannedMealEntry::fromEntity)
            .toList();
    }

    @PostMapping
    public PlannedMealEntry add(
        @RequestBody PlannedMealRequest body,
        @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = CurrentUser.emailOrThrow(principal);
        String slot = body.slot() == null ? "" : body.slot().toLowerCase();
        if (!VALID_SLOTS.contains(slot)) {
            throw new IllegalArgumentException("slot must be one of " + VALID_SLOTS);
        }
        LocalDate date = LocalDate.parse(body.date());
        PlannedMeal saved = repo.save(new PlannedMeal(
            email, date, slot,
            body.name(), body.calories(),
            body.protein(), body.carbs(), body.fat(),
            body.libraryId()
        ));
        return PlannedMealEntry.fromEntity(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(
        @PathVariable Long id,
        @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = CurrentUser.emailOrThrow(principal);
        return repo.findById(id)
            .filter(p -> email.equalsIgnoreCase(p.getOwnerEmail()))
            .map(p -> {
                repo.delete(p);
                return ResponseEntity.noContent().<Void>build();
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
