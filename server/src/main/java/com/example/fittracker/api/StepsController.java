package com.example.fittracker.api;

import com.example.fittracker.api.dto.StepDay;
import com.example.fittracker.api.dto.StepSummary;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/steps")
public class StepsController {

    @GetMapping("/today")
    public StepSummary today() {
        return new StepSummary(6916, 10_000); // mock; DB comes later
    }

    @GetMapping("/week")
    public List<StepDay> week() {
        LocalDate d = LocalDate.now();
        return List.of(
            new StepDay(d.minusDays(6).toString(), 3210),
            new StepDay(d.minusDays(5).toString(), 4890),
            new StepDay(d.minusDays(4).toString(), 7020),
            new StepDay(d.minusDays(3).toString(), 5560),
            new StepDay(d.minusDays(2).toString(), 8420),
            new StepDay(d.minusDays(1).toString(), 9120),
            new StepDay(d.toString(),            6916)
        );
    }
}
