package com.example.fittracker.repository;

import com.example.fittracker.model.PushSubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PushSubscriptionRepository extends JpaRepository<PushSubscriptionEntity, Long> {
    List<PushSubscriptionEntity> findByOwnerEmail(String ownerEmail);
    Optional<PushSubscriptionEntity> findByOwnerEmailAndEndpoint(String ownerEmail, String endpoint);
    void deleteByOwnerEmailAndEndpoint(String ownerEmail, String endpoint);
}
