package health_tracker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import health_tracker.exception.ResourceNotFoundException;
import health_tracker.model.Meal;
import health_tracker.model.User;
import health_tracker.repository.MealRepository;

@Service
public class MealService {

	@Autowired
	MealRepository repo;
	
	public List<Meal> getAllMeals() {
		return repo.findAll();
	}
	
	public List<Meal> getAllUserMeals(int userId) {
		return repo.getAllUserMeals(userId);
	}
	
	public List<Meal> getAllUserMealsFromDate(int userId, String date) {
		return repo.getAllUserMealsFromDate(userId, date);
	}
	
	public Meal createMeal(Meal meal, User user) {
		meal.setId(null);
		Meal created = new Meal(null, meal.getName(), meal.getCalories(), meal.getDate(), meal.getMealType(), user);
		return repo.save(created);
	}
	
	public Meal updateMeal(Meal meal, User user) throws ResourceNotFoundException {
		if (repo.existsById(meal.getId())) {
			meal.setUser(user);
			return repo.save(meal);
		}
		
		return repo.save(new Meal(null, meal.getName(), meal.getCalories(), meal.getDate(), meal.getMealType(), user));
	}
		
	public Meal deleteMealById(int id) throws ResourceNotFoundException {
		Optional<Meal> found = repo.findById(id);
		
		if (found.isEmpty()) {
			throw new ResourceNotFoundException("Meal", id);
		}
		
		repo.deleteById(id);
		return found.get();
	}
	
	public int getCalorieDay(int userId,String date) {
		Optional<Integer> result = repo.getCalorieDay(userId, date);
		
		if(!result.isEmpty()) {
			return result.get();
		} else {
			return 0;
		}
	}
}
