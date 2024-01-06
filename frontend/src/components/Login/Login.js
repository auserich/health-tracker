import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	const handleLogin = async () => {
		const requestObject = {
			username: username,
			password: password,
		};

		try {
			const response = await fetch("http://localhost:8080/authenticate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestObject),
			});

			if (response.ok) {
				const data = await response.json();
				const { jwt } = data;
				localStorage.setItem("jwtToken", jwt);
				localStorage.setItem("username", username);
				navigate("/main");
			} else {
				setSuccessMessage("");
				setErrorMessage("Login failed. Please check your information.");
			}
		} catch (error) {
			console.log(error);
			setSuccessMessage("");
			setErrorMessage("An error occurred. Please try again later.");
		}
	};

		return (
			<div className="login-container">
				<div
					className="login-text-container"
					style={{
						marginBottom: "5vh",
						marginTop: "5vh",
						border: "5px solid black",
						backgroundColor: "rgba(0,20,0,0.6)",
					}}
				>
					<h1>Login to your Account</h1>

					<div className="loginbox">
						<label htmlFor="username">Username</label>
						<br />
						<input
							type="text"
							id="Username"
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div className="loginbox">
						<label htmlFor="password">Password</label>
						<br />
						<input
							type="password"
							id="Password"
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<div className="login">
						<button
							style={{ marginLeft: "-1vw" }}
							onClick={handleLogin}
						>
							Login
						</button>
						<a href="http://localhost:3000/">
							<button>Back to Home</button>
						</a>
					</div>

					{successMessage && (
						<p style={{ color: "green" }}>{successMessage}</p>
					)}
					{errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
				</div>
			</div>
		);
	};
	export default Login;
