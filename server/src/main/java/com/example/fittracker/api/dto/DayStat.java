package com.example.fittracker.api.dto;

public record DayStat(
    String date,
    int nutrientScore,
    int pollutantScore,
    int calories,
    int mealCount
) {}
