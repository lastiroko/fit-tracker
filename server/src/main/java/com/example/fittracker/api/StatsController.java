package com.example.fittracker.api;

import com.example.fittracker.api.dto.DailyStats;
import com.example.fittracker.model.Meal;
import com.example.fittracker.repository.MealRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private static final int DEFAULT_CALORIE_GOAL = 1500;

    private final MealRepository mealRepo;

    public StatsController(MealRepository mealRepo) {
        this.mealRepo = mealRepo;
    }

    @GetMapping("/today")
    public DailyStats getTodayStats() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        List<Meal> meals = mealRepo.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);

        int calories = meals.stream().mapToInt(Meal::getCalories).sum();

        int nutrientScore = weightedAvg(meals, Meal::getNutrientScore);
        int pollutantScore = weightedAvg(meals, Meal::getPollutantScore);

        return new DailyStats(
            nutrientScore,
            pollutantScore,
            calories,
            DEFAULT_CALORIE_GOAL,
            meals.size()
        );
    }

    private int weightedAvg(List<Meal> meals, java.util.function.Function<Meal, Integer> field) {
        long weightedSum = 0;
        long weightTotal = 0;
        for (Meal m : meals) {
            Integer score = field.apply(m);
            if (score == null) continue;
            int weight = Math.max(1, m.getCalories());
            weightedSum += (long) score * weight;
            weightTotal += weight;
        }
        if (weightTotal == 0) return 0;
        return (int) Math.round((double) weightedSum / weightTotal);
    }
}
