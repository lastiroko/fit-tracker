package com.example.fittracker.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDate;

@Entity
@Table(name = "step_logs", uniqueConstraints = @UniqueConstraint(columnNames = {"owner_email", "log_date"}))
public class StepLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_email", length = 254)
    private String ownerEmail;

    @Column(name = "log_date", nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private int count;

    protected StepLog() {}

    public StepLog(String ownerEmail, LocalDate date, int count) {
        this.ownerEmail = ownerEmail;
        this.date = date;
        this.count = count;
    }

    public Long getId() { return id; }
    public String getOwnerEmail() { return ownerEmail; }
    public LocalDate getDate() { return date; }
    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }
}
