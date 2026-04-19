package com.example.fittracker.api;

import com.example.fittracker.api.dto.DailyStats;
import com.example.fittracker.api.dto.DayStat;
import com.example.fittracker.model.Meal;
import com.example.fittracker.repository.MealRepository;
import com.example.fittracker.util.CurrentUser;
import com.example.fittracker.util.DayRange;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private static final int DEFAULT_CALORIE_GOAL = 1500;

    private final MealRepository mealRepo;

    public StatsController(MealRepository mealRepo) {
        this.mealRepo = mealRepo;
    }

    @GetMapping("/today")
    public DailyStats getTodayStats(
        @RequestParam(value = "tz", required = false) String tz,
        @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = CurrentUser.emailOrThrow(principal);
        DayRange range = DayRange.todayIn(tz);
        List<Meal> meals = mealRepo
            .findByOwnerEmailAndCreatedAtBetweenOrderByCreatedAtDesc(email, range.startUtc(), range.endUtc());

        int calories = meals.stream().mapToInt(Meal::getCalories).sum();
        int nutrientScore = weightedAvg(meals, Meal::getNutrientScore);
        int pollutantScore = weightedAvg(meals, Meal::getPollutantScore);

        return new DailyStats(nutrientScore, pollutantScore, calories, DEFAULT_CALORIE_GOAL, meals.size());
    }

    @GetMapping("/week")
    public List<DayStat> getWeekStats(
        @RequestParam(value = "tz", required = false) String tz,
        @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = CurrentUser.emailOrThrow(principal);
        ZoneId zone = DayRange.parseZone(tz);
        LocalDate today = LocalDate.now(zone);
        LocalDate start = today.minusDays(6);

        LocalDateTime startUtc = start.atStartOfDay(zone).withZoneSameInstant(ZoneOffset.UTC).toLocalDateTime();
        LocalDateTime endUtc = today.plusDays(1).atStartOfDay(zone).withZoneSameInstant(ZoneOffset.UTC).toLocalDateTime();

        List<Meal> meals = mealRepo
            .findByOwnerEmailAndCreatedAtBetweenOrderByCreatedAtDesc(email, startUtc, endUtc);

        Map<LocalDate, List<Meal>> byDate = new HashMap<>();
        for (Meal m : meals) {
            LocalDate localDate = m.getCreatedAt()
                .atOffset(ZoneOffset.UTC)
                .atZoneSameInstant(zone)
                .toLocalDate();
            byDate.computeIfAbsent(localDate, k -> new ArrayList<>()).add(m);
        }

        List<DayStat> out = new ArrayList<>(7);
        for (int i = 0; i <= 6; i++) {
            LocalDate d = start.plusDays(i);
            List<Meal> dayMeals = byDate.getOrDefault(d, List.of());
            int calories = dayMeals.stream().mapToInt(Meal::getCalories).sum();
            int nutrientScore = weightedAvg(dayMeals, Meal::getNutrientScore);
            int pollutantScore = weightedAvg(dayMeals, Meal::getPollutantScore);
            out.add(new DayStat(d.toString(), nutrientScore, pollutantScore, calories, dayMeals.size()));
        }
        return out;
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
