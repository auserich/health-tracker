package health_tracker.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class WaterLog implements Serializable {
	
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(name = "ounces", nullable = false)
	private Integer ounces;
	
	@Column(nullable = false)
	private String date;
	
	@ManyToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private User user;
	
	public WaterLog() {
		super();
	}

	public WaterLog(Integer id, Integer ounces, String date, User user) {
		super();
		this.id = id;
		this.ounces = ounces;
		this.date = date;
		this.user = user;
	}
	
	public Integer getId() { return id; } 
	public void setId(Integer id) { this.id = id; } 

	public Integer getOunces() { return ounces; } 
	public void setOunces(Integer waterLogOunces) { this.ounces = waterLogOunces; } 

	public String getDate() { return date; } 
	public void setDate(String date) { this.date = date; } 

	public User getUser() { return user; } 
	public void setUser(User user) { this.user = user; } 

}
