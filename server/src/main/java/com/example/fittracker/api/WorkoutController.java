package com.example.fittracker.api;

import com.example.fittracker.api.dto.Workout;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    @GetMapping
    public List<Workout> list() {
        return List.of(
            new Workout("Morning Run", "cardio", 30, 240),
            new Workout("Core Blast", "strength", 20, 160)
        );
    }
}
