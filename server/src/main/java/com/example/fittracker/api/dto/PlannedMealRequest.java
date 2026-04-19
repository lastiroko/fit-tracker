package com.example.fittracker.api.dto;

public record PlannedMealRequest(
    String date,
    String slot,
    String name,
    int calories,
    double protein,
    double carbs,
    double fat,
    String libraryId
) {}
