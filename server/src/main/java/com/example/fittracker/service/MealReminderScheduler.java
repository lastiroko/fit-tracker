package com.example.fittracker.service;

import com.example.fittracker.config.PushConfig;
import com.example.fittracker.model.PushSubscriptionEntity;
import com.example.fittracker.model.UserPreferences;
import com.example.fittracker.repository.PushSubscriptionRepository;
import com.example.fittracker.repository.UserPreferencesRepository;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import org.apache.http.HttpResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class MealReminderScheduler {

    private static final Logger log = LoggerFactory.getLogger(MealReminderScheduler.class);
    private static final DateTimeFormatter HM = DateTimeFormatter.ofPattern("HH:mm");

    private final UserPreferencesRepository prefsRepo;
    private final PushSubscriptionRepository pushRepo;
    private final PushService pushService;
    private final PushConfig pushConfig;

    public MealReminderScheduler(
        UserPreferencesRepository prefsRepo,
        PushSubscriptionRepository pushRepo,
        PushService pushService,
        PushConfig pushConfig
    ) {
        this.prefsRepo = prefsRepo;
        this.pushRepo = pushRepo;
        this.pushService = pushService;
        this.pushConfig = pushConfig;
    }

    /**
     * Runs at the top of every minute. For each user with reminders enabled,
     * checks if now (in their timezone) matches any configured meal time,
     * and sends a push to all their subscriptions if so.
     */
    @Scheduled(cron = "0 * * * * *")
    public void tick() {
        if (!pushConfig.isConfigured()) return;

        List<UserPreferences> all = prefsRepo.findAll();
        for (UserPreferences p : all) {
            if (!p.isRemindersEnabled()) continue;
            if (p.getMealTimes().isBlank()) continue;

            ZoneId zone;
            try { zone = ZoneId.of(p.getTimezone()); }
            catch (Exception e) { continue; }

            String nowHm = ZonedDateTime.now(zone).format(HM);
            boolean match = false;
            for (String t : p.getMealTimes().split(",")) {
                if (t.trim().equals(nowHm)) { match = true; break; }
            }
            if (!match) continue;

            List<PushSubscriptionEntity> subs = pushRepo.findByOwnerEmail(p.getOwnerEmail());
            if (subs.isEmpty()) continue;

            String payload = payloadFor(p, nowHm);
            for (PushSubscriptionEntity sub : subs) {
                sendOne(sub, payload);
            }
        }
    }

    private String payloadFor(UserPreferences p, String timeHm) {
        String title = "Time to eat";
        String body = switch (p.getCycle()) {
            case "bulk" -> "Hit your next meal — keep stacking the calories.";
            case "cut"  -> "Meal time. Stay on plan, you've got this.";
            default     -> "Your scheduled meal is now. Log it when you're done.";
        };
        // Hand-rolled JSON to avoid pulling Jackson just for this.
        return "{\"title\":\"" + esc(title)
            + "\",\"body\":\"" + esc(body)
            + "\",\"time\":\"" + esc(timeHm)
            + "\",\"url\":\"/\"}";
    }

    private void sendOne(PushSubscriptionEntity sub, String payload) {
        try {
            Subscription.Keys keys = new Subscription.Keys(sub.getP256dh(), sub.getAuth());
            Subscription subscription = new Subscription(sub.getEndpoint(), keys);
            Notification notification = new Notification(subscription, payload);
            HttpResponse resp = pushService.send(notification);
            int status = resp.getStatusLine().getStatusCode();
            if (status == 404 || status == 410) {
                // Endpoint gone — drop the stale subscription.
                pushRepo.delete(sub);
                log.info("Removed expired push subscription {} ({})", sub.getId(), status);
            } else if (status >= 400) {
                log.warn("Push send returned {} for subscription {}", status, sub.getId());
            }
        } catch (Exception e) {
            log.warn("Failed to send push to subscription {}: {}", sub.getId(), e.getMessage());
        }
    }

    private static String esc(String s) {
        return s == null ? "" : s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
