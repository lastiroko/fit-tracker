package com.example.fittracker.api;

import com.example.fittracker.api.dto.StepDay;
import com.example.fittracker.api.dto.StepSummary;
import com.example.fittracker.api.dto.StepUpdate;
import com.example.fittracker.model.StepLog;
import com.example.fittracker.repository.StepLogRepository;
import com.example.fittracker.util.DayRange;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/steps")
public class StepsController {

    private static final int DEFAULT_GOAL = 10_000;

    private final StepLogRepository repo;

    public StepsController(StepLogRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/today")
    public StepSummary today(@RequestParam(value = "tz", required = false) String tz) {
        LocalDate today = DayRange.todayDateIn(tz);
        int count = repo.findById(today).map(StepLog::getCount).orElse(0);
        return new StepSummary(count, DEFAULT_GOAL);
    }

    @PostMapping("/today")
    public StepSummary setToday(
        @RequestParam(value = "tz", required = false) String tz,
        @RequestBody StepUpdate update
    ) {
        LocalDate today = DayRange.todayDateIn(tz);
        int safeCount = Math.max(0, Math.min(200_000, update.count()));
        StepLog log = repo.findById(today)
            .map(existing -> { existing.setCount(safeCount); return existing; })
            .orElseGet(() -> new StepLog(today, safeCount));
        repo.save(log);
        return new StepSummary(safeCount, DEFAULT_GOAL);
    }

    @GetMapping("/week")
    public List<StepDay> week(@RequestParam(value = "tz", required = false) String tz) {
        LocalDate today = DayRange.todayDateIn(tz);
        LocalDate start = today.minusDays(6);

        Map<LocalDate, Integer> byDate = repo.findByDateBetweenOrderByDateAsc(start, today).stream()
            .collect(Collectors.toMap(StepLog::getDate, StepLog::getCount, (a, b) -> a, HashMap::new));

        List<StepDay> out = new java.util.ArrayList<>(7);
        for (int i = 0; i <= 6; i++) {
            LocalDate d = start.plusDays(i);
            out.add(new StepDay(d.toString(), byDate.getOrDefault(d, 0)));
        }
        return out;
    }
}
