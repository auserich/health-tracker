package health_tracker.model;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;

@Entity
public class Exercise implements Serializable{
    private static final long serialVersionUID = 1L;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Integer id;
	
	@Column
	@NotBlank
	private String name;
		
	@Column
	@Positive
	private Integer minutes;
		
	@Column
	@Positive
	private Integer caloriesBurned;
		
	@Column(nullable = false)
	private String date;
	  
	@ManyToOne
	@JoinColumn(name = "user_id") // This is the foreign key in Exercise table
	private User user;

	public Exercise() {
		super();
	}

	public Exercise(Integer id, String name, Integer minutes, Integer caloriesBurned, String date, User user) {
		super();
		this.id = id;
		this.name = name;
		this.minutes = minutes;
		this.caloriesBurned = caloriesBurned;
		this.date = date;
		this.user = user;
	}

	public Integer getId() { return id; } 
	public void setId(Integer id) { this.id = id; } 

	public String getName() { return name; } 
	public void setName(String name) { this.name = name; } 

	public Integer getMinutes() { return minutes; } 
	public void setMinutes(Integer minutes) { this.minutes = minutes; } 

	public Integer getCaloriesBurned() { return caloriesBurned; } 
	public void setCaloriesBurned(Integer caloriesBurned) { this.caloriesBurned = caloriesBurned; } 

	public String getDate() { return date; } 
	public void setDate(String date) { this.date = date; } 

	public User getUser() { return user; } 
	public void setUser(User user) { this.user = user; } 
}
