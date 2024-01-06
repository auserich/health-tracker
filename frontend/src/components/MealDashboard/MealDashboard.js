import { useNavigate } from "react-router-dom";
import Meal from "../Meal/Meal";
import MealWeekDisplay from "../MealWeekDisplay/MealWeekDisplay";
import { Button } from "react-bootstrap";
import { Navbar } from "../Navbar/Navbar";

const MealDashboard = () => {
	const navigate = useNavigate();

	const handleNavigateToMain = () => {
		navigate("/main");
	};

	return (
		<>
			<Navbar></Navbar>
			<MealWeekDisplay />
		</>
	);
};

export default MealDashboard;
