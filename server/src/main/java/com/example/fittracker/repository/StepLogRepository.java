package com.example.fittracker.repository;

import com.example.fittracker.model.StepLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface StepLogRepository extends JpaRepository<StepLog, LocalDate> {
    List<StepLog> findByDateBetweenOrderByDateAsc(LocalDate start, LocalDate end);
}
