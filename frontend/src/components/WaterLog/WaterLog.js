import React, { Component, useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import WeekDisplay from "../WeekDisplay/WeekDisplay.js";
import "./WaterLog.css";

// WaterLog component to handle water logging, both adding and editing
const WaterLog = (props) => {
	// State to manage water ounces, date, id, and error messages
	const [waterOunces, setOunces] = useState("");
	const [waterDate, setDate] = useState("");
	const [waterId, setId] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	// Effect to set initial values when in edit mode and waterData is provided
	useEffect(() => {
		if (props.editMode && props.waterData) {
			if (props.waterData.id) {
				setId(props.waterData.id);
			}
			if (props.waterData.ounces) {
				setOunces(props.waterData.ounces);
			}
			if (props.waterData.date) {
				setDate(props.waterData.date);
			}
		}
	}, [props.editMode, props.waterData]);

	// Event handlers for form input changes
	const handleOuncesChange = (e) => {
		setOunces(e.target.value);
	};

	const handleDateChange = (e) => {
		setDate(e.target.value);
	};

	// Form submission handler
	const handleSubmit = (e) => {
		e.preventDefault();

		// Validation checks for form inputs
		const ounces = parseInt(waterOunces, 10);

		if (isNaN(ounces)) {
			console.error("Invalid input for ounces.");
			return;
		}

		if (!waterDate) {
			setErrorMessage("Date not entered");
			return;
		}

		// Water data to be sent to the server
		const waterData = {
			id: waterId,
			ounces: waterOunces,
			date: waterDate,
		};

		// If in "edit" mode, update the water data; otherwise, add a new entry
		if (props.editMode) {
			editWaterLog(waterData);
		} else {
			addWaterLog(waterData);
		}
	};

	// Function to add a new water log entry
	const addWaterLog = (waterData) => {
		fetch("http://localhost:8080/api/water", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
			body: JSON.stringify(waterData),
		})
			.then((response) => response.json())
			.then((data) => {
				props.handleClose();
			})
			.catch((error) => {
				console.error("Error: ", error);
			});
	};

	// Function to edit an existing water log entry
	const editWaterLog = (waterData) => {
		fetch("http://localhost:8080/api/water", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
			body: JSON.stringify(waterData),
		})
			.then((response) => response.json())
			.then((data) => {
				props.handleClose();
			})
			.catch((error) => {
				console.error("Error: ", error);
			});
	};

	// Render components for the water logging form
	return (
		<>
			{errorMessage && (
				<div className="alert alert-danger" role="alert">
					{errorMessage}
				</div>
			)}
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>Ounces of Water</Form.Label>
					<Form.Control
						type="number"
						placeholder="Enter ounces"
						value={waterOunces}
						onChange={handleOuncesChange}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Date</Form.Label>
					<Form.Control
						type="date"
						placeholder="Enter date"
						value={waterDate}
						onChange={handleDateChange}
					/>
				</Form.Group>
				<Button
					variant="primary"
					type="submit"
					className="mx-auto d-block"
				>
					{props.editMode ? "Update" : "Submit"}
				</Button>
			</Form>
		</>
	);
};

export default WaterLog;
