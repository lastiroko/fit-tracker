package com.example.fittracker.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_preferences")
public class UserPreferences {

    @Id
    @Column(name = "owner_email", length = 254)
    private String ownerEmail;

    /** Comma-separated HH:mm values in the user's timezone, e.g. "08:00,12:30,18:30" */
    @Column(name = "meal_times", length = 255, nullable = false)
    private String mealTimes = "";

    /** IANA timezone the meal times are expressed in, e.g. "Europe/Berlin" */
    @Column(name = "timezone", length = 64, nullable = false)
    private String timezone = "UTC";

    /** bulk | cut | maintain */
    @Column(length = 16, nullable = false)
    private String cycle = "maintain";

    /** Reminders enabled overall. */
    @Column(name = "reminders_enabled", nullable = false)
    private boolean remindersEnabled = false;

    protected UserPreferences() {}

    public UserPreferences(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }

    public String getOwnerEmail() { return ownerEmail; }
    public String getMealTimes() { return mealTimes; }
    public void setMealTimes(String mealTimes) { this.mealTimes = mealTimes == null ? "" : mealTimes; }
    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone == null ? "UTC" : timezone; }
    public String getCycle() { return cycle; }
    public void setCycle(String cycle) { this.cycle = cycle == null ? "maintain" : cycle; }
    public boolean isRemindersEnabled() { return remindersEnabled; }
    public void setRemindersEnabled(boolean v) { this.remindersEnabled = v; }
}
