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
import health_tracker.model.User;
import health_tracker.model.WaterLog;
import health_tracker.service.UserService;
import health_tracker.service.WaterLogService;

@RestController
@RequestMapping("/api")
public class WaterLogController {
	
	@Autowired
	WaterLogService service;
	
	@Autowired
	UserService userService;
	
	@GetMapping("/water/{date}/{id}")
	public ResponseEntity<?> getAllWaterLogsByDateAndUserId(@PathVariable String date, @PathVariable int id) {
		List<WaterLog> waterLogs = service.getAllUserWaterLogs(id, date);
		return ResponseEntity.status(200).body(waterLogs);
	}
	
	@GetMapping("/water/{userId}")
	public ResponseEntity<?> getWaterLogByUserId(@PathVariable int userId) throws ResourceNotFoundException {
		List<WaterLog> found = service.getUserWaterLogs(userId);
		return ResponseEntity.status(200).body(found);
	}
	
	@PostMapping("/water")
	public ResponseEntity<?> createWaterLog(@RequestBody WaterLog water) throws ResourceNotFoundException {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String username = userDetails.getUsername();
		User found = userService.getUserByUsername(username);
		
		System.out.println(found);
		System.out.println(water);
		
		WaterLog created = service.createWaterLog(water, found);
		return ResponseEntity.status(200).body(created);
	}
	
	@PutMapping("/water")
	public ResponseEntity<?> updateWaterLog(@RequestBody WaterLog water) throws ResourceNotFoundException {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String username = userDetails.getUsername();
		User found = userService.getUserByUsername(username);
		
		WaterLog updated = service.updateWaterLog(water, found);
		return ResponseEntity.status(200).body(updated);
	}
	
	@DeleteMapping("/water/{id}")
	public ResponseEntity<?> deleteWaterLogById(@PathVariable int id) throws ResourceNotFoundException {
		WaterLog deleted = service.deleteWaterLogById(id);
		return ResponseEntity.status(200).body(deleted);
	}
	
	@GetMapping("water/ounces/{userId}/{date}")
	public ResponseEntity<?> getWaterFromDate(@PathVariable int userId, @PathVariable String date) {
		int found = service.getWaterDay(userId, date);
		return ResponseEntity.status(200).body(found);
	}
}
