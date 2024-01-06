import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import "./SleepLog.css";

const SleepLog = (props) => {
	const [sleepMinutes, setMinutes] = useState("");
	const [sleepDate, setDate] = useState("");
	const [sleepID, setId] = useState("");

	useEffect(() => {
		if (props.editMode && props.sleepData) {
			if (props.sleepData.minutes) {
				setMinutes(props.sleepData.minutes);
			}
			if (props.sleepData.date) {
				setDate(props.sleepData.date);
			}
			if (props.sleepData.id) {
				setId(props.sleepData.id);
			}
		}
	}, [props.editMode, props.sleepData]);

	const handleMinutesChange = (e) => {
		setMinutes(e.target.value);
	};

	const handleDateChange = (e) => {
		setDate(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const minutes = parseInt(sleepMinutes, 10);

		if (isNaN(minutes) || minutes < 0) {
			console.error("Invalid input for positive time slept.");
			return;
		}

		const sleepData = {
			minutes: sleepMinutes,
			date: sleepDate,
			id: sleepID,
		};

		if (props.editMode) {
			sleepData.id = props.sleepData.id;
			console.log("Attempting: ", sleepData);
			fetch(`http://localhost:8080/api/sleep`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + localStorage.getItem("jwtToken"),
				},
				body: JSON.stringify(sleepData),
			})
				.then((response) => response.json())
				.then((data) => {
					console.log("Sleep data updated: ", data);
					props.handleClose(); // Close the modal after successful update
				})
				.catch((error) => {
					console.error("Error: ", error);
				});
		} else {
			console.log("type: ", sleepMinutes);
			console.log("date: ", sleepDate);
			console.log("id: ", sleepID);

			fetch("http://localhost:8080/api/sleep", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + localStorage.getItem("jwtToken"),
				},
				body: JSON.stringify(sleepData),
			})
				.then((response) => response.json())
				.then((data) => {
					console.log("Data saved: ", data);
					props.handleClose(); // Close the modal after successful submission
				})
				.catch((error) => {
					console.error("Error: ", error);
				});
		}
	};

	return (
		<>
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>Time</Form.Label>
					<Form.Control
						type="number"
						placeholder="Enter type"
						value={sleepMinutes}
						onChange={handleMinutesChange}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Date</Form.Label>
					<Form.Control
						type="date"
						placeholder="Enter date"
						value={sleepDate}
						onChange={handleDateChange}
					/>
				</Form.Group>
				<Button
					variant="primary"
					type="submit"
					className="mx-auto d-block"
				>
					{props.editMode ? "Save Changes" : "Submit"}
				</Button>
			</Form>
		</>
	);
};

export default SleepLog;
