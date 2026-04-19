package com.example.fittracker.repository;

import com.example.fittracker.model.Meal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByOwnerEmailAndCreatedAtBetweenOrderByCreatedAtDesc(
        String ownerEmail, LocalDateTime start, LocalDateTime end);

    List<Meal> findTop200ByOwnerEmailAndCreatedAtAfterOrderByCreatedAtDesc(
        String ownerEmail, LocalDateTime after);
}
