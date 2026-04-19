package com.example.fittracker.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "step_logs")
public class StepLog {

    @Id
    @Column(name = "log_date")
    private LocalDate date;

    @Column(nullable = false)
    private int count;

    protected StepLog() {}

    public StepLog(LocalDate date, int count) {
        this.date = date;
        this.count = count;
    }

    public LocalDate getDate() { return date; }
    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }
}
