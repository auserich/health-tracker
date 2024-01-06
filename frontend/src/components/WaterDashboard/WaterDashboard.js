import React from "react";
import WaterLog from "../WaterLog/WaterLog";
import WeekDisplay from "../WeekDisplay/WeekDisplay";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Navbar } from "../Navbar/Navbar";

const WaterDashboard = () => {
	const navigate = useNavigate();

	const handleNavigateToMain = () => {
		navigate("/main");
	};

	return (
		<>
			<Navbar></Navbar>
			<WeekDisplay />
		</>
	);
};

export default WaterDashboard;
