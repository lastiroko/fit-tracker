package com.example.fittracker.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Entity
@Table(
    name = "push_subscriptions",
    uniqueConstraints = @UniqueConstraint(columnNames = {"owner_email", "endpoint"})
)
public class PushSubscriptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_email", nullable = false, length = 254)
    private String ownerEmail;

    @Column(nullable = false, length = 2048)
    private String endpoint;

    @Column(name = "p256dh", nullable = false, length = 255)
    private String p256dh;

    @Column(name = "auth_secret", nullable = false, length = 255)
    private String auth;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected PushSubscriptionEntity() {}

    public PushSubscriptionEntity(String ownerEmail, String endpoint, String p256dh, String auth) {
        this.ownerEmail = ownerEmail;
        this.endpoint = endpoint;
        this.p256dh = p256dh;
        this.auth = auth;
        this.createdAt = LocalDateTime.now(ZoneOffset.UTC);
    }

    public Long getId() { return id; }
    public String getOwnerEmail() { return ownerEmail; }
    public String getEndpoint() { return endpoint; }
    public String getP256dh() { return p256dh; }
    public String getAuth() { return auth; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
