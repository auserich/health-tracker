package health_tracker.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class Meal implements Serializable {

	private static final long serialVersionUID = 1L;
	
	public static enum MealType {
		BREAKFAST, LUNCH, DINNER, SNACK
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(nullable = false)
	private String name;
	
	@Column(nullable = false)
	private Integer calories;
	
	@Column(nullable = false)
	private String date;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private MealType mealType;
	
	@ManyToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private User user;

	public Meal() {
		super();
	}

	public Meal(Integer id, String name, Integer calories, String date, MealType mealType, User user) {
		super();
		this.id = id;
		this.name = name;
		this.calories = calories;
		this.date = date;
		this.mealType = mealType;
		this.user = user;
	}

	public Integer getId() { return id; } 
	public void setId(Integer id) { this.id = id; } 

	public String getName() { return name; } 
	public void setName(String name) { this.name = name; } 

	public Integer getCalories() { return calories; } 
	public void setCalories(Integer calories) { this.calories = calories; } 

	public String getDate() { return date; } 
	public void setDate(String date) { this.date = date; } 

	public User getUser() { return user; } 
	
	public MealType getMealType() { return mealType; } 
	public void setMealType(MealType mealType) { this.mealType = mealType; } 

	public void setUser(User user) { this.user = user; } 

	@Override
	public String toString() {
		return "Meal [id=" + id + ", name=" + name + ", calories=" + calories + ", date=" + date + ", mealType="
				+ mealType + ", user=" + user + "]";
	}
}
