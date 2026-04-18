package com.example.fittracker.api.dto;

import com.example.fittracker.model.Meal;

import java.time.LocalDateTime;

public record MealEntry(
    Long id,
    String name,
    String brand,
    int calories,
    double protein,
    double carbs,
    double fat,
    String servingSize,
    String source,
    Integer nutrientScore,
    Integer pollutantScore,
    LocalDateTime createdAt
) {
    public static MealEntry fromEntity(Meal meal) {
        return new MealEntry(
            meal.getId(),
            meal.getName(),
            meal.getBrand(),
            meal.getCalories(),
            meal.getProtein(),
            meal.getCarbs(),
            meal.getFat(),
            meal.getServingSize(),
            meal.getSource(),
            meal.getNutrientScore(),
            meal.getPollutantScore(),
            meal.getCreatedAt()
        );
    }
}
