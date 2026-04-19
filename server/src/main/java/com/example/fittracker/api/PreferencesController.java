package com.example.fittracker.api;

import com.example.fittracker.api.dto.PreferencesPayload;
import com.example.fittracker.model.UserPreferences;
import com.example.fittracker.repository.UserPreferencesRepository;
import com.example.fittracker.util.CurrentUser;
import com.example.fittracker.util.DayRange;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.util.Set;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/preferences")
public class PreferencesController {

    private static final Pattern HHMM = Pattern.compile("^([01]\\d|2[0-3]):[0-5]\\d$");
    private static final Set<String> CYCLES = Set.of("bulk", "cut", "maintain");

    private final UserPreferencesRepository repo;

    public PreferencesController(UserPreferencesRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public PreferencesPayload get(@AuthenticationPrincipal OAuth2User principal) {
        String email = CurrentUser.emailOrThrow(principal);
        UserPreferences p = repo.findById(email).orElseGet(() -> repo.save(new UserPreferences(email)));
        return PreferencesPayload.from(p);
    }

    @PutMapping
    public PreferencesPayload put(
        @RequestBody PreferencesPayload body,
        @AuthenticationPrincipal OAuth2User principal
    ) {
        String email = CurrentUser.emailOrThrow(principal);
        UserPreferences p = repo.findById(email).orElseGet(() -> new UserPreferences(email));

        String cycle = body.cycle() == null ? "maintain" : body.cycle().toLowerCase();
        if (!CYCLES.contains(cycle)) {
            throw new IllegalArgumentException("cycle must be one of " + CYCLES);
        }
        p.setCycle(cycle);

        // Validate timezone via ZoneId (falls back to UTC)
        try {
            ZoneId.of(body.timezone());
            p.setTimezone(body.timezone());
        } catch (Exception e) {
            p.setTimezone("UTC");
        }

        StringBuilder times = new StringBuilder();
        if (body.mealTimes() != null) {
            for (String t : body.mealTimes()) {
                if (t == null) continue;
                String trimmed = t.trim();
                if (!HHMM.matcher(trimmed).matches()) continue;
                if (times.length() > 0) times.append(',');
                times.append(trimmed);
            }
        }
        p.setMealTimes(times.toString());

        p.setRemindersEnabled(body.remindersEnabled());
        return PreferencesPayload.from(repo.save(p));
    }

    @SuppressWarnings("unused")
    private static ZoneId _forceCompileDayRangeUsage() { return DayRange.parseZone(null); }
}
