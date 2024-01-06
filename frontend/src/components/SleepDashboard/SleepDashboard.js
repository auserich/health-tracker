import { useNavigate } from "react-router-dom";
import React from "react";
import SleepWeekDisplay from "../SleepWeekDisplay/SleepWeekDisplay";
import { Navbar } from "../Navbar/Navbar";

function SleepDashboard() {
	const navigate = useNavigate();

	const handleNavigateToMain = () => {
		navigate("/main");
	};
	return (
		<>
			<Navbar></Navbar>
			<SleepWeekDisplay />
		</>
	);
}

export default SleepDashboard;
