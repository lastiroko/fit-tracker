package com.example.fittracker.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "planned_meals")
public class PlannedMeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_email", nullable = false, length = 254)
    private String ownerEmail;

    @Column(name = "plan_date", nullable = false)
    private LocalDate date;

    /** breakfast | lunch | dinner | snack */
    @Column(nullable = false, length = 16)
    private String slot;

    @Column(nullable = false)
    private String name;

    private int calories;
    private double protein;
    private double carbs;
    private double fat;

    @Column(name = "library_id", length = 64)
    private String libraryId;

    protected PlannedMeal() {}

    public PlannedMeal(String ownerEmail, LocalDate date, String slot,
                       String name, int calories, double protein, double carbs, double fat,
                       String libraryId) {
        this.ownerEmail = ownerEmail;
        this.date = date;
        this.slot = slot;
        this.name = name;
        this.calories = calories;
        this.protein = protein;
        this.carbs = carbs;
        this.fat = fat;
        this.libraryId = libraryId;
    }

    public Long getId() { return id; }
    public String getOwnerEmail() { return ownerEmail; }
    public LocalDate getDate() { return date; }
    public String getSlot() { return slot; }
    public String getName() { return name; }
    public int getCalories() { return calories; }
    public double getProtein() { return protein; }
    public double getCarbs() { return carbs; }
    public double getFat() { return fat; }
    public String getLibraryId() { return libraryId; }
}
