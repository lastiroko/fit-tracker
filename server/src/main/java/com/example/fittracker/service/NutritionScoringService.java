package com.example.fittracker.service;

import com.example.fittracker.api.dto.FoodScanResult;
import org.springframework.stereotype.Service;

/**
 * Converts a FoodScanResult into two percentage scores:
 *   nutrientScore  — higher = more nutrient-dense / healthier
 *   pollutantScore — higher = more processed / more additives (worse)
 *
 * Prefers Nutri-Score (a-e) and NOVA (1-4) when available,
 * falls back to macro-based heuristics otherwise.
 */
@Service
public class NutritionScoringService {

    public record Scores(int nutrientScore, int pollutantScore) {}

    public Scores score(FoodScanResult r) {
        return new Scores(nutrientScore(r), pollutantScore(r));
    }

    private int nutrientScore(FoodScanResult r) {
        if (r.nutriScore() != null) {
            return switch (r.nutriScore()) {
                case "a" -> 90;
                case "b" -> 75;
                case "c" -> 55;
                case "d" -> 35;
                case "e" -> 15;
                default -> macroFallback(r);
            };
        }
        return macroFallback(r);
    }

    private int macroFallback(FoodScanResult r) {
        double proteinBonus = Math.min(40, r.protein() * 2);       // up to 40 at 20g+ protein
        double fatPenalty = Math.max(0, r.fat() - 10) * 1.5;       // penalty above 10g fat
        double base = 40;
        return clampPct(base + proteinBonus - fatPenalty);
    }

    private int pollutantScore(FoodScanResult r) {
        if (r.novaGroup() != null) {
            return switch (r.novaGroup()) {
                case 1 -> 5;
                case 2 -> 25;
                case 3 -> 55;
                case 4 -> 85;
                default -> 35;
            };
        }
        // Unknown processing: conservative midpoint estimate.
        return 35;
    }

    private int clampPct(double v) {
        return (int) Math.round(Math.max(0, Math.min(100, v)));
    }
}
