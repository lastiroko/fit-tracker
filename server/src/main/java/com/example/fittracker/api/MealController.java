package com.example.fittracker.api;

import com.example.fittracker.api.dto.FoodScanResult;
import com.example.fittracker.api.dto.MealEntry;
import com.example.fittracker.model.Meal;
import com.example.fittracker.repository.MealRepository;
import com.example.fittracker.service.NutritionScoringService;
import com.example.fittracker.service.NutritionScoringService.Scores;
import com.example.fittracker.util.DayRange;
import org.springframework.web.bind.annotation.*;

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
    public MealEntry saveMeal(@RequestBody FoodScanResult scanResult) {
        Scores s = scoring.score(scanResult);
        Meal saved = repo.save(new Meal(scanResult, s.nutrientScore(), s.pollutantScore()));
        return MealEntry.fromEntity(saved);
    }

    @GetMapping("/today")
    public List<MealEntry> getTodayMeals(@RequestParam(value = "tz", required = false) String tz) {
        DayRange range = DayRange.todayIn(tz);
        return repo.findByCreatedAtBetweenOrderByCreatedAtDesc(range.startUtc(), range.endUtc())
            .stream()
            .map(MealEntry::fromEntity)
            .toList();
    }
}
