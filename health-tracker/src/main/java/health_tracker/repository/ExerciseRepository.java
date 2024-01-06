package health_tracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import health_tracker.model.Exercise;


	@Repository
	public interface ExerciseRepository extends JpaRepository<Exercise, Integer> {
	    
	@Query(value = "SELECT * FROM exercise WHERE user_id = ?1", nativeQuery = true)
	public List<Exercise> getAllUserExercises(int userId);
	
	@Query(value = "SELECT * FROM exercise WHERE user_id = ?1 AND date = ?2", nativeQuery = true)
	public List<Exercise> getAllUserExercisesFromDate(int userId, String date);
	
	@Query(value = "SELECT SUM(caloriesBurned) as dayCalories FROM exercise WHERE user_id = ?1 AND date = ?2", nativeQuery = true)
	public Optional<Integer> getCalorieDay(int userId, String date);
	}