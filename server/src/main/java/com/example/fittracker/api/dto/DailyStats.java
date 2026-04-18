package com.example.fittracker.api.dto;

public record DailyStats(
    int nutrientScore,
    int pollutantScore,
    int calories,
    int calorieGoal,
    int mealCount
) {}
