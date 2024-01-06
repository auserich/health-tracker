import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

const EditProfile = (props) => {
	const [goalId, setGoalId] = useState("");
	const [mealGoal, setMealGoal] = useState("");
	const [exerciseGoal, setExerciseGoal] = useState("");
	const [waterGoal, setWaterGoal] = useState("");
	const [sleepGoal, setSleepGoal] = useState("");

	useEffect(() => {
		console.log("Goal Info: ", props.goalInfo);
		setGoalId(props.goalInfo?.id || "");
		setMealGoal(props.goalInfo?.mealGoal || "");
		setExerciseGoal(props.goalInfo?.exerciseGoal || "");
		setWaterGoal(props.goalInfo?.waterGoal || "");
		setSleepGoal(props.goalInfo?.sleepGoal || "");
	}, [props.goalInfo]);

	const handleMealGoalChange = (e) => {
		setMealGoal(e.target.value);
	};

	const handleExerciseGoalChange = (e) => {
		setExerciseGoal(e.target.value);
	};

	const handleWaterGoalChange = (e) => {
		setWaterGoal(e.target.value);
	};

	const handleSleepGoalChange = (e) => {
		setSleepGoal(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const goalData = {
			id: goalId,
			mealGoal,
			exerciseGoal,
			waterGoal,
			sleepGoal,
		};

		console.log("props.goalInfo:", props.goalInfo);
		editGoals(goalData);

		props.handleClose();
	};

	const editGoals = (goalData) => {
		fetch("http://localhost:8080/api/goal", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
			body: JSON.stringify(goalData),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Data updated: ", data);
			})
			.catch((error) => {
				console.error("Error: ", error);
			});
	};

	return (
		<>
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>Meal Goal</Form.Label>
					<Form.Control
						type="number"
						placeholder="Enter meal goal"
						value={mealGoal}
						onChange={handleMealGoalChange}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Exercise Goal</Form.Label>
					<Form.Control
						type="number"
						placeholder="Enter exercise goal"
						value={exerciseGoal}
						onChange={handleExerciseGoalChange}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Water Goal</Form.Label>
					<Form.Control
						type="number"
						placeholder="Enter water goal"
						value={waterGoal}
						onChange={handleWaterGoalChange}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Sleep Goal</Form.Label>
					<Form.Control
						type="number"
						placeholder="Enter sleep goal"
						value={sleepGoal}
						onChange={handleSleepGoalChange}
					/>
				</Form.Group>
				<Button
					variant="primary"
					type="submit"
					className="mx-auto d-block"
				>
					Update
				</Button>
			</Form>
		</>
	);
};

export default EditProfile;
