package health_tracker.exception;

public class ResourceAlreadyExistsException extends Exception {

	private static final long serialVersionUID = 1L;
	
	public ResourceAlreadyExistsException(String resource, int id) {
		super(resource + " with id = " + id + " already exists");
	}
	
	public ResourceAlreadyExistsException(String msg) {
		super(msg);
	}
}
