package com.example.fittracker.api.dto;

import com.example.fittracker.model.PlannedMeal;

public record PlannedMealEntry(
    Long id,
    String date,
    String slot,
    String name,
    int calories,
    double protein,
    double carbs,
    double fat,
    String libraryId
) {
    public static PlannedMealEntry fromEntity(PlannedMeal p) {
        return new PlannedMealEntry(
            p.getId(),
            p.getDate().toString(),
            p.getSlot(),
            p.getName(),
            p.getCalories(),
            p.getProtein(),
            p.getCarbs(),
            p.getFat(),
            p.getLibraryId()
        );
    }
}
