package health_tracker.repository;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import health_tracker.model.Goal;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Integer> {

	@Query(value = "SELECT * FROM goal WHERE user_id = ?1", nativeQuery = true)
	public Optional<Goal> findByUserId(int userId);
	
	@Modifying
	@Transactional
	 @Query(value = "INSERT INTO goal (user_id, meal_goal, exercise_goal, water_goal, sleep_goal) " +
             "VALUES (:userId, 0, 0, 0, 0)", nativeQuery = true)
	 void insertEmptyGoalForUser(@Param("userId") Integer userId);
}
