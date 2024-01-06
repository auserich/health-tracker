import React, { useState, useEffect } from "react";
import {Form, Button} from "react-bootstrap";

const Exercise = (props) => {
	const [exerciseName, setName] = useState("");
	const [exerciseMinutes, setMinutes] = useState("");
	const [exerciseCaloriesBurned, setCaloriesBurned] = useState("");

	const [exerciseDate, setDate] = useState("");
	const [exerciseId, setId] = useState("");


	useEffect(() => {
		if (props.editMode && props.exerciseData) {
			if (props.exerciseData.name) {
				setName(props.exerciseData.name);
			}
			if (props.exerciseData.minutes) {
				setMinutes(props.exerciseData.minutes);
			}
			if (props.exerciseData.caloriesBurned) {
				setCaloriesBurned(props.exerciseData.caloriesBurned);
			}
			if (props.exerciseData.date) {
				setDate(props.exerciseData.date);
			}
			if (props.exerciseData.id) {
				setId(props.exerciseData.id);
			}
		}
	}, [props.editMode, props.exerciseData]);

	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handleMinutesChange = (e) => {
		setMinutes(e.target.value);
	};

	const handleCaloriesBurnedChange = (e) => {
		setCaloriesBurned(e.target.value);
	};

	const handleDateChange = (e) => {
		setDate(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Check if mealName is null before proceeding
		if (exerciseName === null) {
			console.error("Name is null. State might not be updated yet.");
			return;
		}

		const minutes = parseInt(exerciseMinutes, 10);
		const caloriesBurned = parseInt(exerciseCaloriesBurned, 10);

		if (isNaN(minutes)) {
			console.error("Invalid input for minutes exercised");
			return;
		}

		if (isNaN(caloriesBurned)) {
			console.error("Invalid input for calories burned");
			return;
		}

		const exerciseData = {
			id: exerciseId,
			name: exerciseName,
			exerciseMinutes: exerciseMinutes,
			caloriesBurned: exerciseCaloriesBurned,
			date: exerciseDate,
		};

		if (props.editMode) {
			// If in "edit" mode, update the data
			console.log("UPDATING: ", exerciseData);
			editExerciseLog(exerciseData);
		} else {
			// Default to POST request
			console.log("ADDING: ", exerciseData);
			addExerciseLog(exerciseData);
		}
	};

	const addExerciseLog = (exerciseData) => {
		fetch("http://localhost:8080/api/exercise", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
			body: JSON.stringify(exerciseData),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Data saved: ", data);
				props.handleClose(); // Close the modal after successful submission
			})
			.catch((error) => {
				console.error("Error: ", error);
			});
	};

	const editExerciseLog = (exerciseData) => {
		fetch(`http://localhost:8080/api/exercise`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
			body: JSON.stringify(exerciseData),
		})
			.then(console.log("have I crashed yet"))
			.then((response) => response.json())
			.then((data) => {
				console.log(" data updated: ", data);
				props.handleClose(); // Close the modal after successful update
			})
			.catch((error) => {
				console.error("Error: ", error);
			});
	};

	return (
		<>
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>Name</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter workout name"
						value={exerciseName}
						onChange={handleNameChange}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Minutes Active</Form.Label>
					<Form.Control
						type="number"
						placeholder="Enter minutes"
						value={exerciseMinutes}
						onChange={handleMinutesChange}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Estimated Calories Burned</Form.Label>
					<Form.Control
						type="number"
						placeholder="Enter minutes"
						value={exerciseCaloriesBurned}
						onChange={handleCaloriesBurnedChange}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Date</Form.Label>
					<Form.Control
						type="date"
						placeholder="Enter date"
						value={exerciseDate}
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

export default Exercise;
