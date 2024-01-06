import React, { useState, useEffect } from "react";
import {
	Row,
	Col,
	Card,
	Form,
	Button,
	Container,
	Accordion,
	ListGroup,
	Modal,
} from "react-bootstrap";
import "./ExerciseWeekDisplay.css";
import moment from "moment"; // Import Moment.js
import Exercise from "../ExerciseTracker/ExerciseTracker.js";
import { useNavigate } from "react-router-dom";

const ExerciseWeekDisplay = () => {
	const initialDate = localStorage.getItem("currentDate");
	const [currentDate, setCurrentDate] = useState(
		initialDate ? moment(initialDate) : moment()
	);
	//const [currentDate, setCurrentDate] = useState(moment()); // Initialize with the current date using Moment.js
	const [exerciseLogs, setExerciseLogs] = useState([]);
	const [userId, setUserId] = useState(null); // Initialize userId as null
	const days = [];
	const [editExerciseLogData, setEditExerciseLogData] = useState(null);
	const [editMode, setEditMode] = useState(false); // Add this state variable
	const navigate = useNavigate();
	const [selectedExerciseData, setSelectedExerciseData] = useState(null);

	const [showAddExercise, setShowAddExercise] = useState(false);
	// Function to open the modal
	const openAddExerciseModal = () => {
		setEditExerciseLogData(null);
		setEditMode(false); // Set editMode to false when opening the component for adding
		setShowAddExercise(true);
	};
	// Function to close the modal
	const closeAddExerciseModal = () => {
		setShowAddExercise(false);
	};
	const handleAddExerciseSubmit = () => {
		// Add any necessary logic or validation here

		// Close the modal
		closeAddExerciseModal();

		// Clear the selecteddata
		setSelectedExerciseData(null);
		console.log("still maybe not crashed");

		// Instead of reloading the page, you can update the logs for the current week here
		handleRetrieveWeekLogs(userId);
	};

	const firstDayOfWeek = moment(currentDate);

	// Adjust the firstDayOfWeek to always start from Sunday
	if (currentDate.day() !== 0) {
		firstDayOfWeek.day(0);
	}

	const lastDayOfWeek = moment(firstDayOfWeek).day(6); // Get the last day (Saturday) of the selected week

	const handleDateChange = (e) => {
		// setCurrentDate(moment(e.target.value)); // Update the selected date using Moment.js

		const newDate = moment(e.target.value);
		setCurrentDate(newDate);

		// Fetch the logs for the new date
		handleRetrieveWeekLogs(userId, newDate);
	};

	const handleEditExerciseLog = (exerciseLog) => {
		setSelectedExerciseData(exerciseLog);
		setEditMode(true); // Set editMode to true when opening the component for editing
		setShowAddExercise(true); // Open the component in edit mode
	};

	useEffect(() => {
		fetchUserId();
	}, []);

	const fetchUserId = () => {
		// Make a request to your "whoami" endpoint to get the user's ID
		fetch("http://localhost:8080/api/user/whoami", {
			method: "GET",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		})
			.then((response) => response.json())
			.then((data) => {
				// Assuming the user's ID is stored in a property called "id" in the response data
				const user_id = data.id;

				// Now, you have the user's ID, so you can use it to fetch logs
				setUserId(user_id); // Set userId in the component's state
			})
			.catch((error) => {
				console.error("Error fetching user data:", error);
			});
	};

	useEffect(() => {
		fetchUserId();
		//handleRetrieveWeekLogs(userId);
		localStorage.setItem("currentDate", currentDate.format("YYYY-MM-DD"));
	}, [currentDate]);

	useEffect(() => {
		if (userId) {
			handleRetrieveWeekLogs(userId, currentDate);
		}
	}, [userId, currentDate]);

	const handleRetrieveWeekLogs = (userId, newDate) => {
		// const startDate = firstDayOfWeek.format("YYYY-MM-DD"); // Format the start date
		// const endDate = lastDayOfWeek.format("YYYY-MM-DD"); // Format the end date
		const startDate = moment(newDate).startOf("week").format("YYYY-MM-DD");
		const endDate = moment(newDate).endOf("week").format("YYYY-MM-DD");

		fetchExerciseLogsForWeek(startDate, endDate, userId);
	};

	const fetchExerciseLogsForWeek = (startDate, endDate, userId) => {
		const url = `http://localhost:8080/api/exercise/${userId}`;

		console.log("startDate: ", startDate);
		console.log("userId: ", userId);

		fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Exercise logs from user: ", data);

				// Initialize an array with 7 slots, each initially as an empty array
				const exerciseLogsForWeek = Array.from({ length: 7 }, () => []);

				// Filter and map the logs that fall within the current week's range
				const logsWithinWeek = data.filter((log) => {
					return log.date >= startDate && log.date <= endDate;
				});

				logsWithinWeek.forEach((log) => {
					const logDate = moment(log.date);
					const dayIndex = logDate.day(); // Get the day index (0-6) of the log's date
					const exerciseLog = {
						id: log.id,
						name: log.name,
						caloriesBurned: log.caloriesBurned,
						mintues: log.minutes,
					};
					exerciseLogsForWeek[dayIndex].push(exerciseLog);
				});

				console.log("Exercise logs within the week:", exerciseLogsForWeek);

				// Set the meal logs state with the filtered data
				setExerciseLogs(exerciseLogsForWeek);
			})
			.catch((error) => {
				console.error("Error fetching logs:", error);
			});
	};

	const deleteExerciseLog = (exerciseLogId) => {
		// Send a DELETE request to the server-side endpoint
		fetch(`http://localhost:8080/api/exercise/${exerciseLogId}`, {
			method: "DELETE",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(" data deleted: ", data);
				handleAddExerciseSubmit(); // close the modal after successful update
			})
			.catch((error) => {
				console.error("Error deleting log: ", error);
			});
	};


	const totalCaloriesByDay = Array(7).fill(0);

	for (let i = 0; i < 7; i++) {
		const day = moment(firstDayOfWeek).day(i);
		const formattedDateKey = day.format("YYYY-MM-DD"); // Format the date as a key
		const formattedMonthYear = day.format("MMMM YYYY");
		const dayOfWeek = day.format("dddd");
		const date = day.format("D");

		const data = exerciseLogs[i];

		// Sum up the calories for all meals on this day

		const caloriesBurned = data
			? data.reduce((acc, exercise) => acc + exercise.caloriesBurned, 0)
			: 0;
		totalCaloriesByDay[i] = caloriesBurned; // Store the total calories for the day
		const exerciseName = data
			? data.map((exercise) => exercise.name).join(", ")
			: "No ex";
		days.push(
			<Col key={i}>
				<Card className="day">
					<Card.Body>
						<Card.Title className="day-info">
							{formattedMonthYear},
							<br />
							{dayOfWeek} {date}
						</Card.Title>
						<p>Calories Burned: {caloriesBurned}</p>
						{data && data.length !== 0 ? (
							<p>Activity: {exerciseName}</p>
						) : (
							<p>No activity</p>
						)}
					</Card.Body>
				</Card>
			</Col>
		);
	}
	

	const renderAccordionItems = () => {
		const daysOfWeek = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		];

		return daysOfWeek.map((dayOfWeek, index) => {
			const day = moment(firstDayOfWeek).day(index);
			const formattedDate = day.format("MMMM D, YYYY");
			const dateKey = day.format("YYYY-MM-DD");
			const data = exerciseLogs[index];
			const dayExerciseLogs = data || []; // Ensure it's an array
			console.log("DATA!!! ", data);
			return (
				<Accordion.Item key={index} eventKey={index.toString()}>
					<Accordion.Header>
						{dayOfWeek} - {formattedDate}
					</Accordion.Header>
					<Accordion.Body>
						<ListGroup as="ul">
							{dayExerciseLogs.length > 0 ? (
								dayExerciseLogs.map(
									(exerciseLog, exerciseIndex) => (
										<ListGroup.Item
											key={exerciseIndex}
											as="li"
										>
											<Row className="align-items-center">
												<Col>{exerciseLog.name}</Col>
												<Col>
													{exerciseLog.caloriesBurned}
												</Col>
												<Col>
													<Button
														className="me-2"
														onClick={() =>
															handleEditExerciseLog(
																exerciseLog
															)
														}
													>
														Edit
													</Button>
													<Button
														onClick={() =>
															deleteExerciseLog(
																exerciseLog.id
															)
														}
														variant="danger"
													>
														Remove
													</Button>
												</Col>
											</Row>
										</ListGroup.Item>
									)
								)
							) : (
								<ListGroup.Item
									as="li"
									style={{
										height: "55px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									No activity logged for this Day
								</ListGroup.Item>
							)}
						</ListGroup>
					</Accordion.Body>
				</Accordion.Item>
			);
		});
	};

	return (
		<>
			<Card className="centered-container week-display">
				<Card.Title>Exercise Logs for Week</Card.Title>
				<Form>
					<Form.Group className="mb-3">
						<Form.Label>Choose a Week</Form.Label>
						<Form.Control
							type="date"
							placeholder="Enter date"
							value={currentDate.format("YYYY-MM-DD")}
							onChange={handleDateChange}
						/>
					</Form.Group>
				</Form>
				<Row className="week-container">{days}</Row>
				<Button
					onClick={openAddExerciseModal}
					className="custom-button"
				>
					Add Exercise
				</Button>

				<Modal
					show={showAddExercise}
					onHide={closeAddExerciseModal}
					backdrop="static"
				>
					<Modal.Header closeButton>
						<Modal.Title className="text-center">
							{editMode ? "Edit Exercise" : "Add Exercise"}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Exercise
							editMode={editMode}
							handleClose={handleAddExerciseSubmit}
							mealData={selectedExerciseData}
						/>
					</Modal.Body>
				</Modal>
			</Card>
			<Container className="day-details">
				<Accordion alwaysOpen>{renderAccordionItems()}</Accordion>
			</Container>
		</>
	);
};

export default ExerciseWeekDisplay;
