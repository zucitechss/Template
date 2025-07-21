package session_management;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.jdbc.core.JdbcTemplate;

public class SessionCleanupTask {

    private final JdbcTemplate jdbcTemplate;

    public SessionCleanupTask(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Scheduled(fixedRate = 1800000)  // 30 minutes interval
    public void cleanUpExpiredSessions() {
        String sql = "DELETE FROM SPRING_SESSION WHERE EXPIRY_TIME < NOW()";
        jdbcTemplate.update(sql);
    }
}

