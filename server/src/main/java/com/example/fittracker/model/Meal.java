package com.example.fittracker.model;

import com.example.fittracker.api.dto.FoodScanResult;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Entity
@Table(name = "meals")
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String brand;

    private int calories;
    private double protein;
    private double carbs;
    private double fat;

    @Column(name = "serving_size")
    private String servingSize;

    private String source;

    @Column(name = "nutri_score", length = 1)
    private String nutriScore;

    @Column(name = "nova_group")
    private Integer novaGroup;

    @Column(name = "nutrient_score")
    private Integer nutrientScore;

    @Column(name = "pollutant_score")
    private Integer pollutantScore;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected Meal() {}

    public Meal(FoodScanResult result, int nutrientScore, int pollutantScore) {
        this.name = result.name();
        this.brand = result.brand();
        this.calories = result.calories();
        this.protein = result.protein();
        this.carbs = result.carbs();
        this.fat = result.fat();
        this.servingSize = result.servingSize();
        this.source = result.source();
        this.nutriScore = result.nutriScore();
        this.novaGroup = result.novaGroup();
        this.nutrientScore = nutrientScore;
        this.pollutantScore = pollutantScore;
        // Always anchor timestamps to UTC, independent of the VM's wall clock.
        this.createdAt = LocalDateTime.now(ZoneOffset.UTC);
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getBrand() { return brand; }
    public int getCalories() { return calories; }
    public double getProtein() { return protein; }
    public double getCarbs() { return carbs; }
    public double getFat() { return fat; }
    public String getServingSize() { return servingSize; }
    public String getSource() { return source; }
    public String getNutriScore() { return nutriScore; }
    public Integer getNovaGroup() { return novaGroup; }
    public Integer getNutrientScore() { return nutrientScore; }
    public Integer getPollutantScore() { return pollutantScore; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
