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
import "./SleepWeekDisplay.css";
import moment from "moment";
import SleepLog from "../SleepLog/SleepLog.js";
import { useNavigate } from "react-router-dom";

const SleepWeekDisplay = () => {
	const initialDate = localStorage.getItem("currentDate");
	const [currentDate, setCurrentDate] = useState(
		initialDate ? moment(initialDate) : moment()
	);

	const [sleepLogs, setSleepLogs] = useState([]);
	const [userId, setUserId] = useState(null);
	const days = [];
	const [editSleepLogData, setEditSleepLogData] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const navigate = useNavigate();
	const [selectedSleepData, setSelectedSleepData] = useState(null);

	const [showAddSleep, setShowAddSleep] = useState(false);

	const openAddSleepModal = () => {
		setEditSleepLogData(null);
		setEditMode(false);
		setShowAddSleep(true);
	};

	const closeAddSleepModal = () => {
		setShowAddSleep(false);
	};
	const handleAddSleepSubmit = () => {
		closeAddSleepModal();
		setSelectedSleepData(null);
		handleRetrieveWeekLogs(userId);
	};

	const firstDayOfWeek = moment(currentDate);

	if (currentDate.day() !== 0) {
		firstDayOfWeek.day(0);
	}

	const handleDateChange = (e) => {
		const newDate = moment(e.target.value);
		setCurrentDate(newDate);
		// Fetch the logs for the new date
		handleRetrieveWeekLogs(userId, newDate);
	};

	const handleEditSleepLog = (sleepLog) => {
		setSelectedSleepData(sleepLog);
		setEditMode(true); // Set editMode to true
		setShowAddSleep(true);
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

				// Now, you have the user's ID, so you can use it to fetch meal logs
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
		const startDate = moment(newDate).startOf("week").format("YYYY-MM-DD");
		const endDate = moment(newDate).endOf("week").format("YYYY-MM-DD");

		fetchSleepLogsForWeek(startDate, endDate, userId);
	};

	const fetchSleepLogsForWeek = (startDate, endDate, userId) => {
		const url = `http://localhost:8080/api/sleep/${userId}`;

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
				console.log("Stored logs from user: ", data);

				// Initialize an array with 7 slots, each initially as an empty array
				const sleepLogsForWeek = Array.from({ length: 7 }, () => []);

				// Filter and map the logs that fall within the current week's range
				const logsWithinWeek = data.filter((log) => {
					return log.date >= startDate && log.date <= endDate;
				});

				// Populate the relevant slot in mealLogsForWeek with meal logs
				logsWithinWeek.forEach((log) => {
					const logDate = moment(log.date);
					const dayIndex = logDate.day(); // Get the day index (0-6) of the log's date
					const sleepLog = {
						id: log.id,
						minutes: log.minutes,
					};
					sleepLogsForWeek[dayIndex].push(sleepLog);
				});

				console.log("logs within the week:", sleepLogsForWeek);

				setSleepLogs(sleepLogsForWeek);
			})
			.catch((error) => {
				console.error("Error fetching logs:", error);
			});
	};

	const deleteSleepLog = (sleepLogId) => {
		// Send a DELETE request to the server-side endpoint
		fetch(`http://localhost:8080/api/sleep/${sleepLogId}`, {
			method: "DELETE",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		})
			.then((response) => {
				if (response.ok) {
					// The log was successfully deleted on the server.
					window.location.reload();
				} else {
					// Handle errors when the DELETE request fails
					console.error("Error deletingog:", response.statusText);
				}
			})
			.catch((error) => {
				console.error("Error deleting log:", error);
			});
	};
	const totalMinutesByDay = Array(7).fill(0);

	for (let i = 0; i < 7; i++) {
		const day = moment(firstDayOfWeek).day(i);
		const formattedDateKey = day.format("YYYY-MM-DD"); // Format the date as a key
		const formattedMonthYear = day.format("MMMM YYYY");
		const dayOfWeek = day.format("dddd");
		const date = day.format("D");

		const data = sleepLogs[i];
		const minutesStored = data
			? data.reduce((acc, sleepLogs) => acc + sleepLogs.minutes, 0)
			: 0; // Sum up the minutes day
		//sleep exclusive hours conversion
		let hours = 0;
		let minutes = minutesStored;
		if (minutesStored > 60) {
			hours = Math.floor(minutesStored / 60);
			minutes = minutesStored % 60;
		}

		totalMinutesByDay[i] = minutes; //
		// const mealName = data ? data.name : "No Meal";
		// const mealType = data ? data.mealType : "N/A";
		//sleep has no name or type
		days.push(
			<Col key={i} className="day-col">
				<Card className="day">
					<Card.Body>
						<Card.Title className="day-info">
							{formattedMonthYear},
							<br />
							{dayOfWeek} {date}
						</Card.Title>
						<p>
							Time Slept: {hours}:{minutes}
						</p>
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
			const data = sleepLogs[index];
			const daySleepLogs = data || []; // Ensure it's an array
			console.log("DATA!!! ", data);
			return (
				<Accordion.Item key={index} eventKey={index.toString()}>
					<Accordion.Header>
						{dayOfWeek} - {formattedDate}
					</Accordion.Header>
					<Accordion.Body>
						<ListGroup as="ul">
							{daySleepLogs.length > 0 ? (
								daySleepLogs.map((sleepLog, sleepIndex) => (
									<ListGroup.Item key={sleepIndex} as="li">
										<Row className="align-items-center">
											<Col>
												{sleepLog.minutes} Minutes
												Recorded
											</Col>
											<Col>
												<Button
													onClick={() =>
														handleEditSleepLog(
															sleepLog
														)
													}
												>
													Edit
												</Button>
												<Button
													onClick={() =>
														deleteSleepLog(
															sleepLog.id
														)
													}
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
									No Logs for this Day
								</ListGroup.Item>
							)}
						</ListGroup>
					</Accordion.Body>
				</Accordion.Item>
			);
		});
	};

	const handleNavigateToMain = () => {
		navigate("/main");
	};

	return (
		<>
			<Card className="centered-container week-display">
				<Card.Title>Week Display</Card.Title>
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
				<Button onClick={openAddSleepModal} className="custom-button">
					Record Sleep
				</Button>

				{/* Use react-bootstrap Modal to display component as a modal */}
				<Modal
					show={showAddSleep}
					onHide={closeAddSleepModal}
					backdrop="static"
				>
					<Modal.Header closeButton>
						<Modal.Title>
							{editMode ? "Edit Sleep" : "Add Sleep"}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<SleepLog
							editMode={editMode}
							handleClose={handleAddSleepSubmit}
							sleepData={selectedSleepData}
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

export default SleepWeekDisplay;
