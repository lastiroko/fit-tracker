package com.example.fittracker.api.dto;

public record FoodScanResult(
    String name,
    String brand,
    int calories,
    double protein,
    double carbs,
    double fat,
    String servingSize,
    double confidence,
    String source,
    String nutriScore,
    Integer novaGroup
) {
    public FoodScanResult(
        String name,
        String brand,
        int calories,
        double protein,
        double carbs,
        double fat,
        String servingSize,
        double confidence,
        String source
    ) {
        this(name, brand, calories, protein, carbs, fat, servingSize, confidence, source, null, null);
    }
}
