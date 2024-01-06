package health_tracker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import health_tracker.exception.ResourceNotFoundException;
import health_tracker.exception.UsernameTakenException;
import health_tracker.model.User;
import health_tracker.service.UserService;

@CrossOrigin(allowedHeaders="Access-Control-Allow-Origin")
@RestController
@RequestMapping("/api")
public class UserController {
	
	@Autowired
	UserService service;
	
	@GetMapping("/user")
	public List<User> getAllUsers() {
		return service.getAllUsers();
	}
	
	@GetMapping("/user/{id}")
	public ResponseEntity<?> getUserById(@PathVariable int id) throws ResourceNotFoundException {
		User found = service.getUserById(id);
		return ResponseEntity.status(200).body(found);
	}
	
	@GetMapping("/user/whoami")
	public ResponseEntity<?> getCurrentUser() throws ResourceNotFoundException {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String username = userDetails.getUsername();
		User found = service.getUserByUsername(username);
		return ResponseEntity.status(200).body(found);
	}
	
	@PostMapping("/user")
	public ResponseEntity<?> createUser(@RequestBody User user) throws UsernameTakenException {
		User created = service.createUser(user);
		return ResponseEntity.status(200).body(created);
	}
	
	@PutMapping("/user")
	public ResponseEntity<?> updateUser(@RequestBody User user) throws ResourceNotFoundException {
		User updated = service.updateUser(user);
		return ResponseEntity.status(200).body(updated);
	}
	
	@DeleteMapping("/user/{id}")
	public ResponseEntity<?> deleteUserById(@PathVariable int id) throws ResourceNotFoundException {
		User deleted = service.deleteUserById(id);
		return ResponseEntity.status(200).body(deleted);
	}
}
