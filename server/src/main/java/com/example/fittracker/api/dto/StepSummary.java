package com.example.fittracker.api.dto;
/** What the client needs for the ring: current steps + goal */
public record StepSummary(int steps, int goal) {}
