package session_management;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class SessionUtils {

    public static LocalDateTime calculateExpiryTime(long lastAccessedTime, int maxInactiveInterval) {
        // Convert last accessed time (Unix timestamp) to LocalDateTime
        Instant lastAccessInstant = Instant.ofEpochMilli(lastAccessedTime);

        // Calculate the expiry time by adding maxInactiveInterval (in seconds)
        LocalDateTime expiryTime = lastAccessInstant
                .plusSeconds(maxInactiveInterval) // Add inactivity interval
                .atZone(ZoneId.systemDefault())   // Convert to system time zone
                .toLocalDateTime();               // Convert to LocalDateTime
        return expiryTime;
    }
}