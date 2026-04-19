package com.example.fittracker.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;

/**
 * Today's start/end boundaries expressed in UTC LocalDateTime, given a caller's IANA timezone.
 * We store meal.createdAt as UTC LocalDateTime, so querying with UTC bounds is correct.
 */
public record DayRange(LocalDateTime startUtc, LocalDateTime endUtc) {

    public static DayRange todayIn(String ianaTz) {
        ZoneId zone = parseZone(ianaTz);
        LocalDate today = LocalDate.now(zone);
        LocalDateTime startUtc = today.atStartOfDay(zone).withZoneSameInstant(ZoneOffset.UTC).toLocalDateTime();
        LocalDateTime endUtc = today.plusDays(1).atStartOfDay(zone).withZoneSameInstant(ZoneOffset.UTC).toLocalDateTime();
        return new DayRange(startUtc, endUtc);
    }

    public static LocalDate todayDateIn(String ianaTz) {
        return LocalDate.now(parseZone(ianaTz));
    }

    public static ZoneId parseZone(String ianaTz) {
        if (ianaTz == null || ianaTz.isBlank()) return ZoneOffset.UTC;
        try {
            return ZoneId.of(ianaTz);
        } catch (Exception e) {
            return ZoneOffset.UTC;
        }
    }
}
