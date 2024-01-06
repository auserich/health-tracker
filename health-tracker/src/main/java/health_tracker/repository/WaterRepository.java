package health_tracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import health_tracker.model.WaterLog;

@Repository
public interface WaterRepository extends JpaRepository<WaterLog, Integer> {
	
	@Query(value = "SELECT * FROM water_log WHERE user_id = ?1", nativeQuery = true)
	public List<WaterLog> getUserWaterLogs(int userId);
	
	@Query(value = "SELECT w.date AS DateInWeek, COALESCE(SUM(w.ounces), 0) AS TotalOunces " +
            "FROM water_log w " +
            "WHERE w.user_id = :userId " +
            "AND w.date >= DATE_SUB(:date, INTERVAL DAYOFWEEK(:date) - 1 DAY) " +
            "AND w.date < DATE_ADD(:date, INTERVAL 7 - DAYOFWEEK(:date) DAY) " +
            "GROUP BY w.date", nativeQuery = true)
	List<WaterLog> getAllUserWaterLogs(@Param("date") String date, @Param("userId") int userId);
	
	@Query(value = "SELECT SUM(ounces) as dayOunces FROM water_log WHERE user_id = ?1 AND date = ?2", nativeQuery = true)
	public Optional<Integer> getWaterDay(int userId, String date);
}
