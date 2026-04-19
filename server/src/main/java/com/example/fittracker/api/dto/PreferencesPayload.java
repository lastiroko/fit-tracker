package com.example.fittracker.api.dto;

import com.example.fittracker.model.UserPreferences;

import java.util.ArrayList;
import java.util.List;

public record PreferencesPayload(
    List<String> mealTimes,
    String timezone,
    String cycle,
    boolean remindersEnabled
) {
    public static PreferencesPayload from(UserPreferences p) {
        List<String> times = new ArrayList<>();
        for (String s : p.getMealTimes().split(",")) {
            String t = s.trim();
            if (!t.isEmpty()) times.add(t);
        }
        return new PreferencesPayload(times, p.getTimezone(), p.getCycle(), p.isRemindersEnabled());
    }
}
