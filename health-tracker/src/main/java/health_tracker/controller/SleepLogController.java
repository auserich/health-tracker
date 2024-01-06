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

import health_tracker.exception.ResourceNotFoundException;
import health_tracker.model.SleepLog;
import health_tracker.model.User;

import health_tracker.service.SleepLogService;
import health_tracker.service.UserService;


@RestController
@RequestMapping("/api")
public class SleepLogController {
	@Autowired
	SleepLogService service;
	
	@Autowired
	UserService userService;
	
	@GetMapping("/sleep/{date}/{id}")
	public ResponseEntity<?> getAllSleepLogsByDateAndUserId(@PathVariable String date, @PathVariable int id) {
		List<SleepLog> sleepLogs = service.getAllUserSleepLogs(id, date);
		return ResponseEntity.status(200).body(sleepLogs);
	}
	
	@GetMapping("/sleep/{id}")
	public ResponseEntity<?> getSleepLogById(@PathVariable int id) throws ResourceNotFoundException {
		List<SleepLog> found = service.getUserSleepLogs(id);
		return ResponseEntity.status(200).body(found);
	}
	
	@PostMapping("/sleep")
	public ResponseEntity<?> createSleepLog(@RequestBody SleepLog sleep) throws ResourceNotFoundException {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String username = userDetails.getUsername();
		User found = userService.getUserByUsername(username);
		
		System.out.println(found);
		System.out.println(sleep);
		
		SleepLog created = service.createSleepLog(sleep, found);
		return ResponseEntity.status(200).body(created);
	}

	@PutMapping("/sleep")
	public ResponseEntity<?> updateSleepLog(@RequestBody SleepLog sleep) throws ResourceNotFoundException {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String username = userDetails.getUsername();
		User found = userService.getUserByUsername(username);
		
		SleepLog updated = service.updateSleepLog(sleep, found);
		return ResponseEntity.status(200).body(updated);
	}
	
	@DeleteMapping("/sleep/{id}")
	public ResponseEntity<?> deleteSleepLogById(@PathVariable int id) throws ResourceNotFoundException {
		SleepLog deleted = service.deleteSleepLogById(id);
		return ResponseEntity.status(200).body(deleted);
	}
	
	@GetMapping("sleep/total/{userId}/{date}")
	public ResponseEntity<?> getMinutesFromDate(@PathVariable int userId, @PathVariable String date) {
		int found = service.getMinuteDay(userId, date);
		return ResponseEntity.status(200).body(found);
	}
}