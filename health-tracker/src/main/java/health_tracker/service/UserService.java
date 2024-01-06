package health_tracker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import health_tracker.exception.ResourceNotFoundException;
import health_tracker.exception.UsernameTakenException;
import health_tracker.model.User;
import health_tracker.repository.GoalRepository;
import health_tracker.repository.UserRepository;

@Service
public class UserService {
	
	@Autowired
	UserRepository repo;
	
	@Autowired
	GoalRepository goalRepo;
	
	@Autowired
	PasswordEncoder encoder;
	
	public List<User> getAllUsers() {
		return repo.findAll();
	}
	
	public User getUserById(int id) throws ResourceNotFoundException {
		Optional<User> found = repo.findById(id);
		
		if (found.isEmpty()) {
			throw new ResourceNotFoundException("User", id);
		}
		
		return found.get();
	}
	
	public User getUserByUsername(String username) throws ResourceNotFoundException {
		Optional<User> found = repo.findByUsername(username);
		
		if (found.isEmpty()) {
			throw new ResourceNotFoundException("User", -1);
		}
		
		return found.get();
	}
	
	public User createUser(User user) throws UsernameTakenException {
		Optional<User> exists = repo.findByUsername(user.getUsername());
		
		if (!exists.isEmpty()) {
			throw new UsernameTakenException(user);
		}
		
		user.setId(null);
		user.setPassword(encoder.encode(user.getPassword()));
		User created = repo.save(user);
		
		//TODO: find a better solution
		// needed to initialize empty goal table for user
		goalRepo.insertEmptyGoalForUser(created.getId());
		
		return created;
	}
	
	public User updateUser(User user) throws ResourceNotFoundException {
		if (repo.existsById(user.getId())) {
			User updated = repo.save(user);
			return updated;
		}
		
		throw new ResourceNotFoundException("User", user.getId());
	}
	
	public User deleteUserById(int id) throws ResourceNotFoundException {
		Optional<User> found = repo.findById(id);
		
		if (found.isEmpty()) {
			throw new ResourceNotFoundException("User", id);
		}
		
		repo.deleteById(id);
		return found.get();
	}
}
