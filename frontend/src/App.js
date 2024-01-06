import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Landing from "./components/Landing/Landing";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import WaterLog from "./components/WaterLog/WaterLog";
import SleepLog from "./components/SleepLog/SleepLog";
import WeekDisplay from "./components/WeekDisplay/WeekDisplay";
import WaterDashboard from "./components/WaterDashboard/WaterDashboard";
import SleepDashboard from "./components/SleepDashboard/SleepDashboard";
import ExerciseDashBoard from "./components/ExerciseDashboard/Dashboard";
import Meal from "./components/Meal/Meal";
import MealDashboard from "./components/MealDashboard/MealDashboard";
import MainDashboard from "./components/MainDashboard/MainDashboard";
import Profile from "./components/Profile/Profile";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/exercise-tracker" element={<ExerciseDashBoard />} />
				<Route path="/water" element={<WaterDashboard />} />
				<Route path="/sleep" element={<SleepDashboard />} />
				<Route path="/meal" element={<MealDashboard />} />
				<Route path="/main" element={<MainDashboard />} />
				<Route path="/profile" element={<Profile />} />
			</Routes>
		</div>
	);
}

export default App;
