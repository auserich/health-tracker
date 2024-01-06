package health_tracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import health_tracker.model.SleepLog;

@Repository
public interface SleepRepository extends JpaRepository<SleepLog, Integer> {

	@Query(value = "SELECT * FROM sleep_log WHERE user_id = ?1", nativeQuery = true)
	public List<SleepLog> getUserSleepLogs(int userId);
	
	@Query(value = "SELECT s.date AS DateInWeek, COALESCE(SUM(s.minutes), 0) AS TotalMinutes " +
            "FROM sleep_log s " +
            "WHERE s.user_id = :userId " +
            "AND s.date >= DATE_SUB(:date, INTERVAL DAYOFWEEK(:date) - 1 DAY) " +
            "AND s.date < DATE_ADD(:date, INTERVAL 7 - DAYOFWEEK(:date) DAY) " +
            "GROUP BY s.date", nativeQuery = true)
	
	List<SleepLog> getAllUserSleepLogs(@Param("date") String date, @Param("userId") int userID);
	
	@Query(value = "SELECT SUM(minutes) as dayMinutes FROM sleep_log WHERE id = ?1 AND date = ?2", nativeQuery = true)
	public Optional<Integer> getMinuteDay(int userId, String date);
}
