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
@Table(name = "favorite_foods")
public class FavoriteFood {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_email", nullable = false, length = 254)
    private String ownerEmail;

    @Column(nullable = false)
    private String name;

    private String brand;
    private int calories;
    private double protein;
    private double carbs;
    private double fat;

    @Column(name = "serving_size")
    private String servingSize;

    @Column(name = "nutri_score", length = 1)
    private String nutriScore;

    @Column(name = "nova_group")
    private Integer novaGroup;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected FavoriteFood() {}

    public FavoriteFood(String ownerEmail, FoodScanResult r) {
        this.ownerEmail = ownerEmail;
        this.name = r.name();
        this.brand = r.brand();
        this.calories = r.calories();
        this.protein = r.protein();
        this.carbs = r.carbs();
        this.fat = r.fat();
        this.servingSize = r.servingSize();
        this.nutriScore = r.nutriScore();
        this.novaGroup = r.novaGroup();
        this.createdAt = LocalDateTime.now(ZoneOffset.UTC);
    }

    public FoodScanResult toScanResult() {
        return new FoodScanResult(
            name, brand, calories, protein, carbs, fat, servingSize,
            1.0, "favorite", nutriScore, novaGroup
        );
    }

    public Long getId() { return id; }
    public String getOwnerEmail() { return ownerEmail; }
    public String getName() { return name; }
    public String getBrand() { return brand; }
    public int getCalories() { return calories; }
    public double getProtein() { return protein; }
    public double getCarbs() { return carbs; }
    public double getFat() { return fat; }
    public String getServingSize() { return servingSize; }
    public String getNutriScore() { return nutriScore; }
    public Integer getNovaGroup() { return novaGroup; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
