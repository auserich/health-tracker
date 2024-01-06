import { useNavigate } from "react-router-dom";
import ExerciseWeekDisplay from "../ExerciseWeekDisplay/ExerciseWeekDisplay";
import { Navbar } from "../Navbar/Navbar";

const ExerciseDashboard = () => {
	const navigate = useNavigate();

	const handleNavigateToMain = () => {
		navigate("/main");
	};

	return (
		<>
			<Navbar></Navbar>
			<ExerciseWeekDisplay />
		</>
	);
};

export default ExerciseDashboard;
