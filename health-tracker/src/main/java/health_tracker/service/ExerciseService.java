package health_tracker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import health_tracker.exception.ResourceNotFoundException;
import health_tracker.model.User;
import health_tracker.model.Exercise;
import health_tracker.repository.ExerciseRepository;

@Service
public class ExerciseService {

    @Autowired
    ExerciseRepository repo;

    public List<Exercise> getAllExercises() {
    	return repo.findAll();
	}
	
	public List<Exercise> getAllUserExercises(int userId) {
		return repo.getAllUserExercises(userId);
	}
	
	public List<Exercise> getAllUserExercisesFromDate(int userId, String date) {
		return repo.getAllUserExercisesFromDate(userId, date);
	}
	
	public Exercise createExercise(Exercise exercise, User user) {
		exercise.setId(null);
		Exercise created = new Exercise(null, exercise.getName(),exercise.getMinutes(), exercise.getCaloriesBurned(), exercise.getDate(), user);
		return repo.save(created);
	}
	
	public Exercise updateExercise(Exercise exercise, User user) throws ResourceNotFoundException {
		if (repo.existsById(exercise.getId())) {
			exercise.setUser(user);
			return repo.save(exercise);
		}
		
		return repo.save(new Exercise(null, exercise.getName(),exercise.getMinutes(), exercise.getCaloriesBurned(), exercise.getDate(), user));
	}
		
	public Exercise deleteExerciseById(int id) throws ResourceNotFoundException {
		Optional<Exercise> found = repo.findById(id);
		
		if (found.isEmpty()) {
			throw new ResourceNotFoundException("Exercise", id);
		}
		
		repo.deleteById(id);
		return found.get();
	}
	
	public int getCaloriesBurnedDay(int userId,String date) {
		Optional<Integer> result = repo.getCalorieDay(userId, date);
		
		if(!result.isEmpty()) {
			return result.get();
		} else {
			return 0;
		}
	}
}
