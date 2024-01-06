package health_tracker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import health_tracker.exception.ResourceNotFoundException;
import health_tracker.model.User;
import health_tracker.model.SleepLog;
import health_tracker.repository.SleepRepository;

@Service
public class SleepLogService {

	@Autowired
	SleepRepository repo;
	
	public List<SleepLog> getAllUserSleepLogs(int userId, String currentDate) {
        List<SleepLog> sleepLogs = repo.getAllUserSleepLogs(currentDate, userId);
        System.out.println(sleepLogs);
        return sleepLogs;
	}
	
	public List<SleepLog> getUserSleepLogs(int userId) {
		return repo.getUserSleepLogs(userId);
	}
	
	
	public SleepLog getSleepLogById(int id) throws ResourceNotFoundException {
		Optional<SleepLog> found = repo.findById(id);
		
		if (found.isEmpty()) {
			throw new ResourceNotFoundException("SleepLog", id);
		}
		
		return found.get();
	}
	
	public SleepLog createSleepLog(SleepLog sleep, User user) {
		sleep.setId(null);
		
		SleepLog created = new SleepLog(null, sleep.getMinutes(), sleep.getDate(), user);
		return repo.save(created);
	}
	
	public SleepLog updateSleepLog(SleepLog sleep, User user) throws ResourceNotFoundException {
		if (repo.existsById(sleep.getId())) {
			sleep.setUser(user);
			return repo.save(sleep);
		}
		
		return repo.save(new SleepLog(null, sleep.getMinutes(), sleep.getDate(), user));
	}
	
	public SleepLog deleteSleepLogById(int id) throws ResourceNotFoundException {
		Optional<SleepLog> found = repo.findById(id);
		if (found.isEmpty()) {
			throw new ResourceNotFoundException("SleepLog", id);
		}
		repo.deleteById(id);
		return found.get();
	}
	
	public int getMinuteDay(int userId,String date) {
		Optional<Integer> result = repo.getMinuteDay(userId, date);
		
		if(!result.isEmpty()) {
			return result.get();
		} else {
			return 0;
		}
	}
}
