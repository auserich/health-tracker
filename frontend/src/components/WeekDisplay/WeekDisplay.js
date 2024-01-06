import React, { useState, useEffect } from "react";
import {
	Row,
	Col,
	Card,
	Form,
	Button,
	Accordion,
	ListGroup,
	Container,
	Modal,
} from "react-bootstrap";
import "./WeekDisplay.css";
import moment from "moment"; // Import Moment.js
import WaterLog from "../WaterLog/WaterLog";

// Week display component to manage and display weekly water logs
const WeekDisplay = () => {
	// State for the current date, meal logs, user ID, and other variables
	const [currentDate, setCurrentDate] = useState(moment()); // Initialize with the current date using Moment.js
	const [waterLogs, setWaterLogs] = useState([]);
	const [userId, setUserId] = useState(null); // Initialize userId as null
	const days = [];
	const [selectedWaterData, setSelectedWaterData] = useState(null);

	const firstDayOfWeek = moment(currentDate);

	// Adjust the firstDayOfWeek to always start from Sunday
	if (currentDate.day() !== 0) {
		firstDayOfWeek.day(0);
	}

	const lastDayOfWeek = moment(firstDayOfWeek).day(6); // Get the last day (Saturday) of the selected week

	const [editWaterLogData, setEditWaterLogData] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [showAddWater, setShowAddWater] = useState(false);
	const [deleteMode, setDeleteMode] = useState(false);

	// Function to open the Add Water modal
	const openAddWaterModal = () => {
		setEditWaterLogData(null);
		setEditMode(false);
		setDeleteMode(false);
		setShowAddWater(true);
	};

	// Function to close the Add water modal
	const closeAddWaterModal = () => {
		setShowAddWater(false);
	};

	// Callback function for when adding or editing water is submitted
	const handleAddWaterSubmit = () => {
		closeAddWaterModal();
		setSelectedWaterData(null);
		handleRetrieveWeekLogs(userId);
	};

	// Handle change of date in the form
	const handleDateChange = (e) => {
		setCurrentDate(moment(e.target.value)); // Update the selected date using Moment.js
	};

	// Initial fetch to gett he user ID
	useEffect(() => {
		fetchUserId();
	}, []);

	// Fetch user ID whenever the currentDate changes
	useEffect(() => {
		fetchUserId();
		localStorage.setItem("currentDate", currentDate.format("YYYY-MM-DD"));
	}, [currentDate]);

	// Fetch water logs when userId or currentDate changes
	useEffect(() => {
		if (userId) {
			handleRetrieveWeekLogs(userId, currentDate);
		}
	}, [userId, currentDate]);

	// Function to handle editing water log
	const handleEditWaterLog = (waterLog) => {
		console.log("water log: ", waterLog);
		setSelectedWaterData(waterLog);
		setEditMode(true);
		setShowAddWater(true);
	};

	// Function to handle deleting water log
	const handleDeleteWaterLog = (waterLog) => {
		setSelectedWaterData(waterLog);
		setDeleteMode(true);
		setShowAddWater(true);
	};

	// Function to fetch the user ID
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
				setUserId(user_id); // Set userId in the component's state
			})
			.catch((error) => {
				console.error("Error fetching user data:", error);
			});
	};

	// Function to retrieve water logs for the current week
	const handleRetrieveWeekLogs = (userId) => {
		const startDate = firstDayOfWeek.format("YYYY-MM-DD");
		const endDate = lastDayOfWeek.format("YYYY-MM-DD");
		fetchWaterLogsForWeek(startDate, endDate, userId);
	};

	// Function to fetch water logs for a specific week
	const fetchWaterLogsForWeek = (startDate, endDate, userId) => {
		const url = `http://localhost:8080/api/water/${userId}`;
		fetch(url, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		})
			.then((response) => response.json())
			.then((data) => {
				const waterLogsForWeek = Array.from({ length: 7 }, () => []);
				const logsWithinWeek = data.filter((log) => {
					return log.date >= startDate && log.date <= endDate;
				});
				logsWithinWeek.forEach((log) => {
					const logDate = moment(log.date);
					const dayIndex = logDate.day();
					const waterLog = {
						id: log.id,
						ounces: log.ounces,
						date: log.date,
					};
					waterLogsForWeek[dayIndex].push(waterLog);
				});
				setWaterLogs(waterLogsForWeek);
			})
			.catch((error) => {
				console.error("Error fetching water logs:", error);
			});
	};

	// Function to delete a water log
	const deleteWaterLog = (waterLogId) => {
		fetch(`http://localhost:8080/api/water/${waterLogId}`, {
			method: "DELETE",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		})
			.then((response) => response.json())
			.then((data) => {
				handleAddWaterSubmit(); // close the modal after successful update
			})
			.catch((error) => {
				console.error("Error deleting water log: ", error);
			});
	};

	const totalOuncesByDay = Array(7).fill(0);

	for (let i = 0; i < 7; i++) {
		const day = moment(firstDayOfWeek).day(i);
		const formattedMonthYear = day.format("MMMM YYYY");
		const dayOfWeek = day.format("dddd");
		const date = day.format("D");
		const data = waterLogs[i];

		// Sum up the ounces for all water logs on this day
		const ounces = data
			? data.reduce((acc, water) => acc + water.ounces, 0)
			: 0;

		totalOuncesByDay[i] = ounces; // Store the total ounces for the day

		days.push(
			<Col key={i} className="day-col">
				<Card className="day">
					<Card.Body>
						<Card.Title className="day-info">
							{formattedMonthYear}
							<br />
							{dayOfWeek} {date}
						</Card.Title>
						<p>Ounces: {ounces}</p>
					</Card.Body>
				</Card>
			</Col>
		);
	}

	// Function to render items inside the Accordion component
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
			const data = waterLogs[index];
			const dayWaterLogs = data || []; // ensure it's an array

			return (
				// Render each day as an Accordion Item
				<Accordion.Item key={index} eventKey={index.toString()}>
					<Accordion.Header>
						{dayOfWeek} - {formattedDate}
					</Accordion.Header>
					<Accordion.Body>
						<ListGroup as="ul">
							{dayWaterLogs.length > 0 ? (
								dayWaterLogs.map((waterLog, waterIndex) => (
									<ListGroup.Item key={waterIndex} as="li">
										<Row className="align-items-center">
											<Col>{waterLog.ounces}</Col>
											<Col>
												<Button
													className="me-2"
													onClick={() =>
														handleEditWaterLog(
															waterLog
														)
													}
												>
													Edit
												</Button>
												<Button
													onClick={() =>
														deleteWaterLog(
															waterLog.id
														)
													}
													variant="danger"
												>
													Remove
												</Button>
											</Col>
										</Row>
									</ListGroup.Item>
								))
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
									No water logged for this day
								</ListGroup.Item>
							)}
						</ListGroup>
					</Accordion.Body>
				</Accordion.Item>
			);
		});
	};

	// Render the components for WeekDisplay
	return (
		<>
			<Card className="centered-container week-display">
				<Card.Title>Water Logs for Week</Card.Title>
				<Form>
					<Form.Group className="mb-3">
						<Form.Label>Choose a Week</Form.Label>
						<Form.Control
							type="date"
							placeholder="Enter date"
							value={currentDate.format("YYYY-MM-DD")} // Use Moment.js to format the date
							onChange={handleDateChange}
						/>
					</Form.Group>
				</Form>
				<Row className="week-container">{days}</Row>
				<Button
					variant="primary"
					onClick={openAddWaterModal}
					className="custom-button"
				>
					Add Water
				</Button>
			</Card>

			<Modal
				show={showAddWater}
				onHide={closeAddWaterModal}
				backdrop="static"
			>
				<Modal.Header closeButton>
					<Modal.Title className="text-center">
						{editMode ? "Edit Water" : "Add Water"}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<WaterLog
						editMode={editMode}
						handleClose={handleAddWaterSubmit}
						waterData={selectedWaterData}
					></WaterLog>
				</Modal.Body>
			</Modal>

			<Container className="day-details">
				<Accordion alwaysOpen>{renderAccordionItems()}</Accordion>
			</Container>
		</>
	);
};

export default WeekDisplay;
