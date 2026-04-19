package com.example.fittracker.repository;

import com.example.fittracker.model.PlannedMeal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PlannedMealRepository extends JpaRepository<PlannedMeal, Long> {
    List<PlannedMeal> findByOwnerEmailAndDateBetweenOrderByDateAscSlotAsc(
        String ownerEmail, LocalDate start, LocalDate end);
}
