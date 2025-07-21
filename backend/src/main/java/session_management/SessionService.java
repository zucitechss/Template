package session_management;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class SessionService {

    private final JdbcTemplate jdbcTemplate;
    private static final Logger logger = LoggerFactory.getLogger(SessionService.class);

    public SessionService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional
    public String createSession(String email, int maxInactiveIntervalInSeconds) {
        // Validate the email
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        String sessionId = UUID.randomUUID().toString();
        long currentTimeMillis = System.currentTimeMillis();
        long expiryTimeMillis = currentTimeMillis + (maxInactiveIntervalInSeconds * 1000);

        try {
            String sql = "INSERT INTO spring_session (SESSION_ID, max_inactive_interval, last_access_time, principal_name, expiry_time, CREATION_TIME, PRIMARY_ID) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, sessionId, maxInactiveIntervalInSeconds, currentTimeMillis, email, expiryTimeMillis, currentTimeMillis, sessionId);

            logger.info("Created new session for email: {} with session ID: {} and expiry time: {}", email, sessionId, expiryTimeMillis);
        } catch (Exception e) {
            logger.error("Error creating session: {}", e.getMessage(), e);
            logger.info("Creating session with values: email = {}, sessionId = {}, maxInactiveIntervalInSeconds = {}, currentTimeMillis = {}",
                    email, sessionId, maxInactiveIntervalInSeconds, currentTimeMillis);
            throw new RuntimeException("Error creating session", e);
        }

        return sessionId;
    }



    @Transactional
    public void updateSessionExpiryTime(String sessionId, int maxInactiveIntervalInSeconds) {
        long currentTimeMillis = System.currentTimeMillis();
        long expiryTimeMillis = currentTimeMillis + (maxInactiveIntervalInSeconds * 1000);

        // Update the session's expiry time in the database
        String sql = "UPDATE spring_session SET expiry_time = ?, last_accessed_time = ? WHERE SESSION_ID = ?";
        jdbcTemplate.update(sql, expiryTimeMillis, currentTimeMillis, sessionId);

        logger.info("Updated session expiry time for session ID: {} to new expiry time: {}", sessionId, expiryTimeMillis);
    }

    @Transactional
    public void invalidateSession(String sessionId) {
        // Mark session as invalid in the database
        String sql = "UPDATE spring_session SET session_status = 'INVALID' WHERE SESSION_ID = ?";
        jdbcTemplate.update(sql, sessionId);

        logger.info("Invalidated session with session ID: {}", sessionId);
    }

    @Transactional
    public boolean isSessionExpired(String sessionId) {
        // Check if session has expired
        String sql = "SELECT expiry_time FROM spring_session WHERE SESSION_ID = ?";
        Long expiryTimeMillis = jdbcTemplate.queryForObject(sql, Long.class, sessionId);
        boolean expired = expiryTimeMillis != null && expiryTimeMillis < System.currentTimeMillis();

        logger.info("Session with session ID: {} is expired: {}", sessionId, expired);
        return expired;
    }

    @Transactional
    public boolean isSessionActive(String sessionId) {
        // Check if the session is active or expired
        String sql = "SELECT session_status FROM spring_session WHERE SESSION_ID = ?";
        String sessionStatus = jdbcTemplate.queryForObject(sql, String.class, sessionId);
        boolean active = "ACTIVE".equals(sessionStatus);

        logger.info("Session with session ID: {} is active: {}", sessionId, active);
        return active;
    }
}
