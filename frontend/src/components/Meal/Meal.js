import React, { useState, useEffect } from "react";
import { Card, Form, Button, Modal, Row, Col } from "react-bootstrap";
import MacronutrientChart from "./MacronutrientChart.js";

// Functional component for Meal Log form
const Meal = (props) => {
	// State hooks to manage form data and component state
	const [mealName, setName] = useState("");
	const [mealCalories, setCalories] = useState("");
	const [mealCarbs, setMealCarbs] = useState("");
	const [mealFats, setMealFats] = useState("");
	const [mealProtein, setMealProtein] = useState("");
	const [mealDate, setDate] = useState("");
	const [mealId, setId] = useState("");
	const mealTypeOptions = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];
	const [mealType, setType] = useState(mealTypeOptions[0]);
	const [errorMessage, setErrorMessage] = useState("");
	const [nutritionData, setNutritionData] = useState("");
	const [currentDate, setCurrentDate] = useState("");

	// useEffect to populate form data when in edit mode
	useEffect(() => {
		if (props.editMode && props.mealData) {
			if (props.mealData.id) {
				setId(props.mealData.id);
			}
			if (props.mealData.name) {
				setName(props.mealData.name);
			}
			if (props.mealData.calories) {
				setCalories(props.mealData.calories);
			}
			if (props.mealData.mealType) {
				setType(props.mealData.mealType);
			}
			if (props.mealData.date) {
				setDate(props.mealData.date);
			}
		}
	}, [props.editMode, props.mealData]);

	// Event handlers for form input changes
	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handleCaloriesChange = (e) => {
		setCalories(e.target.value);
	};

	const handleTypeChange = (e) => {
		setType(e.target.value);
	};

	const handleDateChange = (e) => {
		setDate(e.target.value);
	};

	// Form submission handler
	const handleSubmit = (e) => {
		e.preventDefault();

		// Validation checks for form inputs
		if (!mealName) {
			setErrorMessage("Name not entered");
			return;
		}

		const calories = parseInt(mealCalories, 10);

		if (isNaN(calories)) {
			setErrorMessage("Calories not entered");
			return;
		}

		if (calories < 1) {
			setErrorMessage("Calories cannot be less than 1");
			return;
		}

		if (!mealDate) {
			setErrorMessage("Date not entered");
			return;
		}

		// Create mealData object for API request
		const mealData = {
			id: mealId,
			name: mealName,
			calories: mealCalories,
			mealType: mealType,
			date: mealDate,
			carbs: mealCarbs,
			fats: mealFats,
			protein: mealProtein,
		};

		// Call appropriate API method based on editMode
		if (props.editMode) {
			editMealLog(mealData);
		} else {
			addMealLog(mealData);
		}
	};

	// Utility function to capitalize the first letter of each word in a string
	const capitalizeFirstLetter = (string) => {
		return string
			.split(" ")
			.map(
				(word) =>
					word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
			)
			.join(" ");
	};

	// API call to add a new meal log
	const addMealLog = (mealData) => {
		mealData.name = mealData.name.toLowerCase();
		mealData.name = capitalizeFirstLetter(mealData.name);

		fetch("http://localhost:8080/api/meal", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
			body: JSON.stringify(mealData),
		})
			.then((response) => response.json())
			.then((data) => {
				props.handleClose();
			})
			.catch((error) => {
				console.error("Error: ", error);
			});
	};

	// API call to searchf or nutrition data of a meal
	const searchMeal = (mealName) => {
		setErrorMessage("");
		fetch(`http://localhost:8080/api/meal/nutrition/${mealName}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		})
			.then((response) => response.json())
			.then((data) => {
				// Check if data has an "items" property and it's an array with at least one item
				if (
					data.items &&
					Array.isArray(data.items) &&
					data.items.length > 0
				) {
					setCalories(data.items[0].calories);
					setMealCarbs(data.items[0].carbohydrates_total_g);
					setMealFats(data.items[0].fat_total_g);
					setMealProtein(data.items[0].protein_g);
				} else {
					setErrorMessage(`No meals found with name ${mealName}`);
				}
			})
			.catch((error) => {
				console.error("Error fetching nutrition data:", error);
			});
	};

	// Event handler for the search button
	const handleSearch = () => {
		searchMeal(mealName);
	};

	// API call to edit an existing meal log
	const editMealLog = (mealData) => {
		mealData.name = mealData.name.toLowerCase();
		mealData.name = capitalizeFirstLetter(mealData.name);

		fetch(`http://localhost:8080/api/meal`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
			body: JSON.stringify(mealData),
		})
			.then((response) => response.json())
			.then((data) => {
				props.handleClose();
			})
			.catch((error) => {
				console.error("Error: ", error);
			});
	};

	// Data for the MacronutrientChart component
	const macronutrientData = {
		labels: ["Protein", "Carbohydrates", "Fat"],
		datasets: [
			{
				data: [mealProtein, mealCarbs, mealFats], // Sample values
				backgroundColor: ["pink", "lightgreen", "lightblue"],
			},
		],
	};

	// Render components for the meal logging form
	return (
		<>
			{errorMessage && (
				<div className="alert alert-danger" role="alert">
					{errorMessage}
				</div>
			)}
			<MacronutrientChart data={macronutrientData} />
			<Form onSubmit={handleSubmit}>
				<Form.Group className="mb-3">
					<Form.Label>Name</Form.Label>
					<Row>
						<Col xs lg="9">
							<Form.Control
								type="text"
								placeholder="Enter meal name"
								value={mealName}
								onChange={handleNameChange}
							/>
						</Col>
						<Col>
							<Button onClick={handleSearch}>Search</Button>
						</Col>
					</Row>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Calories</Form.Label>
					<Form.Control
						type="number"
						placeholder="Enter calories"
						value={mealCalories}
						onChange={handleCaloriesChange}
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Type</Form.Label>
					<Form.Control
						as="select"
						value={mealType}
						onChange={handleTypeChange}
					>
						{mealTypeOptions.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</Form.Control>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label>Date</Form.Label>
					<Form.Control
						type="date"
						placeholder="Enter date"
						value={mealDate}
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

export default Meal;
