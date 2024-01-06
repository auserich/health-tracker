package health_tracker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import health_tracker.exception.ResourceAlreadyExistsException;
import health_tracker.exception.ResourceNotFoundException;
import health_tracker.model.Goal;
import health_tracker.model.User;
import health_tracker.repository.GoalRepository;
import health_tracker.repository.UserRepository;

@Service
public class GoalService {

	@Autowired
	GoalRepository repo;
	
	@Autowired
	UserRepository userRepo;
	
	public List<Goal> getAllGoals() {
		return repo.findAll();
	}
	
	public Goal getGoalById(int id) throws ResourceNotFoundException {
		Optional<Goal> found = repo.findById(id);
		
		if (found.isEmpty()) {
			throw new ResourceNotFoundException("Goal", id);
		}
		
		return found.get();
	}
	
	public Goal getGoalByUserId(int userId) throws ResourceNotFoundException {
		Optional<User> user = userRepo.findById(userId);
		
		if (user.isEmpty()) {
			throw new ResourceNotFoundException("User", userId);
		}
		
		Optional<Goal> found = repo.findByUserId(userId);
		
		if (found.isEmpty()) {
			throw new ResourceNotFoundException("Goal", userId);
		}
		
		return found.get();
	}
	
	public Goal createGoal(Goal goal, User user) throws ResourceAlreadyExistsException {
		// if user already has a goal
		if (repo.findByUserId(user.getId()).isPresent()) {
			throw new ResourceAlreadyExistsException("Goal", user.getGoal().getId());
		}
		
		goal.setId(null);
		Goal created = new Goal(null, goal.getMealGoal(), goal.getExerciseGoal(), goal.getWaterGoal(), goal.getSleepGoal(), user);
		return repo.save(created);
	}
	
	public Goal updateGoal(Goal goal, User user) {
		if (repo.existsById(goal.getId())) {
			goal.setUser(user);
			return repo.save(goal);
		}
		
		return repo.save(new Goal(null, goal.getMealGoal(), goal.getExerciseGoal(), goal.getWaterGoal(), goal.getSleepGoal(), user));
	}
	
	public Goal deleteGoalById(int id) throws ResourceNotFoundException {
		Optional<Goal> found = repo.findById(id);
		
		if (found.isEmpty()) {
			throw new ResourceNotFoundException("Goal", id);
		}
		
		repo.deleteById(id);
		return found.get();
	}
}
