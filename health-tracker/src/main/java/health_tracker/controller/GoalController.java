package health_tracker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import health_tracker.exception.ResourceAlreadyExistsException;
import health_tracker.exception.ResourceNotFoundException;
import health_tracker.model.Goal;
import health_tracker.model.User;
import health_tracker.service.GoalService;
import health_tracker.service.UserService;

@RestController
@RequestMapping("/api")
public class GoalController {

	@Autowired
	GoalService service;
	
	@Autowired
	UserService userService;
	
	@GetMapping("/goal")
	public List<Goal> getAllGoals() {
		return service.getAllGoals();
	}
	
	@GetMapping("/goal/{userId}")
	public ResponseEntity<?> getGoalByUserId(@PathVariable int userId) throws ResourceNotFoundException {
		Goal found = service.getGoalByUserId(userId);
		return ResponseEntity.status(200).body(found);
	}
	
	@PostMapping("/goal")
	public ResponseEntity<?> createGoal(@RequestBody Goal goal) throws ResourceNotFoundException, ResourceAlreadyExistsException {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		User found = userService.getUserByUsername(userDetails.getUsername());
		
		Goal created = service.createGoal(goal, found);
		return ResponseEntity.status(200).body(created);
	}
	
	@PutMapping("/goal")
	public ResponseEntity<?> updateGoal(@RequestBody Goal goal) throws ResourceNotFoundException {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		User found = userService.getUserByUsername(userDetails.getUsername());
		
		Goal updated = service.updateGoal(goal, found);
		return ResponseEntity.status(200).body(updated);
	}
	
	@DeleteMapping("/goal/{id}")
	public ResponseEntity<?> deleteGoal(@PathVariable int id) throws ResourceNotFoundException {
		Goal deleted = service.deleteGoalById(id);
		return ResponseEntity.status(200).body(deleted);
	}
}
