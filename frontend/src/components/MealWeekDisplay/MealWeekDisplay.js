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
import "./MealWeekDisplay.css";
import moment from "moment"; // Import Moment.js
import Meal from "../Meal/Meal.js"; // Import the Meal component
import { useNavigate } from "react-router-dom";

//  Week display component to manage and display weekly meal logs
const MealWeekDisplay = () => {
	// State for the current date, meal logs, user ID, and other variables
	const initialDate = localStorage.getItem("currentDate");
	const [currentDate, setCurrentDate] = useState(
		initialDate ? moment(initialDate) : moment()
	);
	const [mealLogs, setMealLogs] = useState([]);
	const [userId, setUserId] = useState(null);
	const [editMode, setEditMode] = useState(false); // Add this state variable
	const [selectedMealData, setSelectedMealData] = useState(null);
	const [editMealLogData, setEditMealLogData] = useState(null);

	// State for controlling the Add Meal modal
	const [showAddMeal, setShowAddMeal] = useState(false);

	// Function to open the modal
	const openAddMealModal = () => {
		setEditMealLogData(null);
		setEditMode(false);
		setShowAddMeal(true);
	};

	// Function to close the modal
	const closeAddMealModal = () => {
		setShowAddMeal(false);
	};

	// Function to handle the Add Meal form submission
	const handleAddMealSubmit = () => {
		closeAddMealModal();
		setSelectedMealData(null);
		renderContent();
	};

	// Function to render the content (update meal logs, render UI)
	const renderContent = () => {
		handleRetrieveWeekLogs(userId, currentDate);
		renderWeekItems();
		renderAccordionItems();
	};

	// Calculate the first and last day of the week based on the selected date
	const firstDayOfWeek = moment(currentDate);
	if (currentDate.day() !== 0) {
		firstDayOfWeek.day(0);
	}
	const lastDayOfWeek = moment(firstDayOfWeek).day(6); // Get the last day (Saturday) of the selected week

	// Function to handle date change inthe form
	const handleDateChange = (e) => {
		const newDate = moment(e.target.value);
		setCurrentDate(newDate);
		renderContent();
	};

	// Fetch meal logs when userId or currentDate changes
	useEffect(() => {
		if (userId) {
			handleRetrieveWeekLogs(userId, currentDate);
		}
	}, [userId, currentDate]);

	// Function to handle editing a meal log
	const handleEditMealLog = (mealLog) => {
		console.log("meal log: ", mealLog);
		setSelectedMealData(mealLog);
		setEditMode(true);
		setShowAddMeal(true);
		renderContent();
	};

	// Initial fetch for user ID on component mount
	useEffect(() => {
		fetchUserId();
		//renderContent();
	}, []);

	// Function to fetch the user ID from the server
	const fetchUserId = () => {
		fetch("http://localhost:8080/api/user/whoami", {
			method: "GET",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		})
			.then((response) => response.json())
			.then((data) => {
				const user_id = data.id;
				setUserId(user_id);
			})
			.catch((error) => {
				console.error("Error fetching user data:", error);
			});
	};

	// Update user ID and local storage when the selected date changes
	useEffect(() => {
		fetchUserId();
		localStorage.setItem("currentDate", currentDate.format("YYYY-MM-DD"));
	}, [currentDate]);

	// Fetch meal logs when user ID or selected date changes
	useEffect(() => {
		if (userId) {
			handleRetrieveWeekLogs(userId, currentDate);
		}
	}, [userId, currentDate]);

	// Function to fetch meal logs for the week
	const handleRetrieveWeekLogs = (userId, newDate) => {
		const startDate = moment(newDate).startOf("week").format("YYYY-MM-DD");
		const endDate = moment(newDate).endOf("week").format("YYYY-MM-DD");

		fetchMealLogsForWeek(startDate, endDate, userId);
	};

	//  Function to fetch meal logs for the specified date range
	const fetchMealLogsForWeek = (startDate, endDate, userId) => {
		const url = `http://localhost:8080/api/meal/${userId}`;
		fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		})
			.then((response) => response.json())
			.then((data) => {
				const mealLogsForWeek = Array.from({ length: 7 }, () => []);
				const logsWithinWeek = data.filter((log) => {
					return log.date >= startDate && log.date <= endDate;
				});

				logsWithinWeek.forEach((log) => {
					const logDate = moment(log.date);
					const dayIndex = logDate.day();
					const mealLog = {
						id: log.id,
						calories: log.calories,
						name: log.name,
						mealType: log.mealType,
						date: log.date,
					};
					mealLogsForWeek[dayIndex].push(mealLog);
				});

				setMealLogs(mealLogsForWeek);
			})
			.catch((error) => {
				console.error("Error fetching meal logs:", error);
			});
	};

	// Function to delete a meal log
	const deleteMealLog = (mealLogId) => {
		fetch(`http://localhost:8080/api/meal/${mealLogId}`, {
			method: "DELETE",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		})
			.then((response) => response.json())
			.then((data) => {
				handleAddMealSubmit(); // close the modal after successful update
			})
			.catch((error) => {
				console.error("Error deleting meal log: ", error);
			});

		renderContent();
	};

	// Function to capitalize the first letter of a string
	const capitalizeFirstLetter = (str) => {
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	};

	// Array to store total calories for each day of the week
	const totalCaloriesByDay = Array(7).fill(0);

	// Function to check if a specific meal type is logged for a day
	const isMealTypeLogged = (mealLogsForWeek, dayIndex, mealType) => {
		const logsForDay = mealLogsForWeek[dayIndex];
		return logsForDay
			? logsForDay.some((log) => log.mealType === mealType)
			: false;
	};

	// Function to render a meal type in UI
	const renderMealType = (mealType, index) => {
		const mealTypeIndex = mealType.toUpperCase();
		const isLogged = isMealTypeLogged(mealLogs, index, mealTypeIndex);
		const mealTypeStyle = isLogged ? "green" : "red";

		return (
			<Row>
				<span style={{ color: mealTypeStyle }}>
					{capitalizeFirstLetter(mealType)}
				</span>
			</Row>
		);
	};

	// Function to render individual days of the week
	const renderWeekItems = () => {
		const days = [];

		for (let i = 0; i < 7; i++) {
			const day = moment(firstDayOfWeek).day(i);
			const formattedDateKey = day.format("YYYY-MM-DD"); // Format the date as a key
			const formattedMonthYear = day.format("MMMM YYYY");
			const dayOfWeek = day.format("dddd");
			const date = day.format("D");

			const data = mealLogs[i];
			console.log("data: ", data);
			const renderBreakfast = () => (
				<span>{renderMealType("Breakfast", i)}</span>
			);
			const renderLunch = () => <span>{renderMealType("Lunch", i)}</span>;
			const renderDinner = () => (
				<span>{renderMealType("Dinner", i)}</span>
			);

			// Sum up the calories for all meals on this day
			const calories = data
				? data.reduce((acc, meal) => acc + meal.calories, 0)
				: 0;

			totalCaloriesByDay[i] = calories; // Store the total calories for the day
			const mealName = data
				? data.map((meal) => meal.name).join(", ")
				: "No Meal";
			const mealType = data
				? data.map((meal) => meal.mealType).join(", ")
				: "N/A";

			days.push(
				<Col key={i} className="day-col">
					<Card className="day">
						<Card.Body>
							<Card.Title className="day-info">
								{formattedMonthYear}
								<br />
								{dayOfWeek} {date}
							</Card.Title>
							<p>Calories: {calories}</p>
							{renderBreakfast()}
							{renderLunch()}
							{renderDinner()}
						</Card.Body>
					</Card>
				</Col>
			);
		}

		return days;
	};

	// Function to render the accordion items
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
			const data = mealLogs[index];
			const dayMealLogs = data || []; // Ensure it's an array

			// Group meal logs by meal type
			const groupedMealLogs = {};
			dayMealLogs.forEach((mealLog) => {
				const mealType = mealLog.mealType;
				if (!groupedMealLogs[mealType]) {
					groupedMealLogs[mealType] = [];
				}
				groupedMealLogs[mealType].push(mealLog);
			});

			// Render each day as an Accordion Item
			return (
				<Accordion.Item key={index} eventKey={index.toString()}>
					<Accordion.Header>
						{dayOfWeek} - {formattedDate}
					</Accordion.Header>
					<Accordion.Body>
						<ListGroup as="ul">
							{Object.entries(groupedMealLogs).map(
								([mealType, logs]) => (
									<React.Fragment key={mealType}>
										<ListGroup.Item
											as="li"
											className="meal-type-header"
											style={{
												fontWeight: "bold",
												height: "55px",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											{capitalizeFirstLetter(mealType)}
										</ListGroup.Item>
										{logs.map((mealLog, mealIndex) => (
											<ListGroup.Item
												key={mealIndex}
												as="li"
											>
												<Row className="align-items-center">
													<Col>{mealLog.name}</Col>
													<Col>
														{mealLog.calories}
													</Col>
													<Col>
														<Button
															className="me-2"
															onClick={() =>
																handleEditMealLog(
																	mealLog
																)
															}
														>
															Edit
														</Button>
														<Button
															onClick={() =>
																deleteMealLog(
																	mealLog.id
																)
															}
															variant="danger"
														>
															Remove
														</Button>
													</Col>
												</Row>
											</ListGroup.Item>
										))}
									</React.Fragment>
								)
							)}
							{Object.keys(groupedMealLogs).length === 0 && (
								<ListGroup.Item
									as="li"
									style={{
										height: "55px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									No meals logged for this Day
								</ListGroup.Item>
							)}
						</ListGroup>
					</Accordion.Body>
				</Accordion.Item>
			);
		});
	};

	// Render the components for MealWeekDisplay
	return (
		<>
			<Card className="centered-container week-display">
				<Card.Title>Meal Logs for Week</Card.Title>
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
				<Row className="week-container">{renderWeekItems()}</Row>
				<Button onClick={openAddMealModal} className="custom-button">
					Add Meal
				</Button>

				<Modal
					show={showAddMeal}
					onHide={closeAddMealModal}
					backdrop="static"
				>
					<Modal.Header closeButton>
						<Modal.Title className="text-center">
							{editMode ? "Edit Meal" : "Add Meal"}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Meal
							editMode={editMode}
							handleClose={handleAddMealSubmit}
							mealData={selectedMealData}
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

export default MealWeekDisplay;
