package health_tracker.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

@Entity
public class Goal implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	// calories eaten
	private Integer mealGoal;
	
	// calories burned
	private Integer exerciseGoal;
	
	// ounces drank
	private Integer waterGoal;
	
	// hours slept
	private Integer sleepGoal;
	
	@OneToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private User user;

	public Goal() {
		super();
	}

	public Goal(Integer id, Integer mealGoal, Integer exerciseGoal, Integer waterGoal, Integer sleepGoal, User user) {
		super();
		this.id = id;
		this.mealGoal = mealGoal;
		this.exerciseGoal = exerciseGoal;
		this.waterGoal = waterGoal;
		this.sleepGoal = sleepGoal;
		this.user = user;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getMealGoal() {
		return mealGoal;
	}

	public void setMealGoal(Integer mealGoal) {
		this.mealGoal = mealGoal;
	}

	public Integer getExerciseGoal() {
		return exerciseGoal;
	}

	public void setExerciseGoal(Integer exerciseGoal) {
		this.exerciseGoal = exerciseGoal;
	}

	public Integer getWaterGoal() {
		return waterGoal;
	}

	public void setWaterGoal(Integer waterGoal) {
		this.waterGoal = waterGoal;
	}

	public Integer getSleepGoal() {
		return sleepGoal;
	}

	public void setSleepGoal(Integer sleepGoal) {
		this.sleepGoal = sleepGoal;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	
}
