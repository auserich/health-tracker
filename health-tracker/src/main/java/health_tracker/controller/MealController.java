package health_tracker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
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
import org.springframework.web.client.RestTemplate;

import health_tracker.exception.ResourceNotFoundException;
import health_tracker.model.Meal;
import health_tracker.model.User;
import health_tracker.service.MealService;
import health_tracker.service.UserService;

@RestController
@RequestMapping("/api")
public class MealController {

	@Value("${nutrition.api.key}")
    private String API_KEY;
	
	@Autowired
	MealService service;
	
	@Autowired
	UserService userService;
	
	@Autowired
    private RestTemplate restTemplate;
	
	@GetMapping("/meal")
	public List<Meal> getAllMeals() {
		return service.getAllMeals();
	}
	
	@GetMapping("/meal/{userId}")
	public ResponseEntity<?> getAllUserMeals(@PathVariable int userId) {
		List<Meal> found = service.getAllUserMeals(userId);
		return ResponseEntity.status(200).body(found);
	}
	
	@GetMapping("meal/{userId}/{date}")
	public ResponseEntity<?> getAllUserMealsFromDate(@PathVariable int userId, @PathVariable String date) {
		List<Meal> found = service.getAllUserMealsFromDate(userId, date);
		return ResponseEntity.status(200).body(found);
	}
	
	@GetMapping("/meal/nutrition/{meal}")
	public ResponseEntity<?> getMealNutrition(@PathVariable String meal) {
		String apiUrl = "https://api.calorieninjas.com/v1/nutrition?query=" + meal;
		HttpHeaders headers = new HttpHeaders();
		
		headers.set("X-Api-Key", API_KEY);
		HttpEntity<String> entity = new HttpEntity<>(headers);
		
		ResponseEntity<String> responseEntity = restTemplate.exchange(apiUrl, HttpMethod.GET, entity, String.class);
		String responseBody = responseEntity.getBody();
		
		return ResponseEntity.status(responseEntity.getStatusCode()).body(responseBody);
	}
	
	@PostMapping("/meal")
	public ResponseEntity<?> createMeal(@RequestBody Meal meal) throws ResourceNotFoundException {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		User found = userService.getUserByUsername(userDetails.getUsername());

		Meal created = service.createMeal(meal, found);
		return ResponseEntity.status(200).body(created);
	}
	
	@PutMapping("/meal")
	public ResponseEntity<?> updateMeal(@RequestBody Meal meal) throws ResourceNotFoundException {
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		User found = userService.getUserByUsername(userDetails.getUsername());
		
		Meal updated = service.updateMeal(meal, found);
		return ResponseEntity.status(200).body(updated);
	}
	
	@DeleteMapping("meal/{id}")
	public ResponseEntity<?> deleteMeal(@PathVariable int id) throws ResourceNotFoundException {
		Meal deleted = service.deleteMealById(id);
		return ResponseEntity.status(200).body(deleted);
	}
	
	@GetMapping("meal/calories/{userId}/{date}")
	public ResponseEntity<?> getCaloriesFromDate(@PathVariable int userId, @PathVariable String date) {
		int found = service.getCalorieDay(userId, date);
		return ResponseEntity.status(200).body(found);
	}
}
