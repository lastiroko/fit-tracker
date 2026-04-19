package com.example.fittracker.api.dto;

import com.example.fittracker.model.FavoriteFood;

public record FavoriteEntry(
    Long id,
    String name,
    String brand,
    int calories,
    double protein,
    double carbs,
    double fat,
    String servingSize,
    String nutriScore,
    Integer novaGroup
) {
    public static FavoriteEntry fromEntity(FavoriteFood f) {
        return new FavoriteEntry(
            f.getId(),
            f.getName(),
            f.getBrand(),
            f.getCalories(),
            f.getProtein(),
            f.getCarbs(),
            f.getFat(),
            f.getServingSize(),
            f.getNutriScore(),
            f.getNovaGroup()
        );
    }
}
