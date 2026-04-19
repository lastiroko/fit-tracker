package com.example.fittracker.repository;

import com.example.fittracker.model.FavoriteFood;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteFoodRepository extends JpaRepository<FavoriteFood, Long> {
    List<FavoriteFood> findByOwnerEmailOrderByCreatedAtDesc(String ownerEmail);
}
