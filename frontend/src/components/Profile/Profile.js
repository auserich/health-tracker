import React, { useEffect, useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { Button, Card, Col, ListGroup, Modal, Row } from "react-bootstrap";
import userImage from "../../assets/user.png";
import "./Profile.css";
import EditProfile from "./EditProfile";

const Profile = () => {
	const [userInfo, setUserInfo] = useState(null);
	const [userId, setUserId] = useState(null);
	const [goalInfo, setGoalInfo] = useState(null);
	const [showEditGoalData, setShowEditGoalData] = useState(false);

	useEffect(() => {
		fetchUserInfo();
	}, []);

	useEffect(() => {
		if (userId) {
			fetchGoalInfo();
		}
	}, [userId]);

	const toggleEditGoal = () => {
		setShowEditGoalData(!showEditGoalData);

		fetchGoalInfo();
	};

	const fetchUserInfo = () => {
		// Make a request to your "whoami" endpoint to get the user's ID
		fetch("http://localhost:8080/api/user/whoami", {
			method: "GET",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		})
			.then((response) => response.json())
			.then((data) => {
				setUserInfo(data); // store user info
				setUserId(data.id);
				console.log("User Info: ", data);
			})
			.catch((error) => {
				console.error("Error fetching user data:", error);
			});
	};

	const fetchGoalInfo = () => {
		fetch(`http://localhost:8080/api/goal/${userId}`, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + localStorage.getItem("jwtToken"),
			},
		})
			.then((response) => response.json())
			.then((data) => {
				setGoalInfo(data); // store user's goal info
				console.log("Goal Info: ", data);
			})
			.catch((error) => {
				console.error("Error fetching user data:", error);
			});
	};

	const handleEditGoalClose = () => {
		// Fetch updated goal info after closing the modal
		fetchGoalInfo();
		toggleEditGoal();
	};

	return (
		<>
			<Navbar></Navbar>
			<Card style={{ width: "30rem" }} className="mx-auto mt-5 p-5">
				<Card.Img
					variant="top"
					src={userImage}
					className="profile-image mx-auto"
				/>
				<Card.Body>
					<Card.Title>{localStorage.getItem("username")}</Card.Title>
					{userInfo ? ( // Check if userInfo is not null before rendering email
						<Card.Text>{userInfo.email}</Card.Text>
					) : (
						<Card.Text>Loading...</Card.Text>
					)}
				</Card.Body>
				<ListGroup className="list-group-flush">
					<ListGroup.Item>
						<Row>
							<Col>
								<span style={{ fontWeight: "bold" }}>
									Meal Goal:
								</span>
							</Col>
							<Col>
								{goalInfo && goalInfo.mealGoal > 0
									? goalInfo.mealGoal
									: "No Goal Set"}
							</Col>
						</Row>
					</ListGroup.Item>
					<ListGroup.Item>
						<Row>
							<Col>
								<span style={{ fontWeight: "bold" }}>
									Exercise Goal:
								</span>
							</Col>
							<Col>
								{goalInfo && goalInfo.exerciseGoal > 0
									? goalInfo.exerciseGoal
									: "No Goal Set"}
							</Col>
						</Row>
					</ListGroup.Item>
					<ListGroup.Item>
						<Row>
							<Col>
								<span style={{ fontWeight: "bold" }}>
									Water Goal:
								</span>
							</Col>
							<Col>
								{goalInfo && goalInfo.waterGoal > 0
									? goalInfo.waterGoal
									: "No Goal Set"}
							</Col>
						</Row>
					</ListGroup.Item>
					<ListGroup.Item>
						<Row>
							<Col>
								<span style={{ fontWeight: "bold" }}>
									Sleep Goal:
								</span>
							</Col>
							<Col>
								{goalInfo && goalInfo.sleepGoal > 0
									? goalInfo.sleepGoal
									: "No Goal Set"}
							</Col>
						</Row>
					</ListGroup.Item>
				</ListGroup>
				<Card.Body>
					<Button className="ms-2" onClick={toggleEditGoal}>
						Edit Weekly Goals
					</Button>
				</Card.Body>
			</Card>

			<Modal
				show={showEditGoalData}
				onHide={() => setShowEditGoalData(false)}
				backdrop="static"
			>
				<Modal.Header closeButton>
					<Modal.Title>Edit Goals</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{showEditGoalData && (
						<EditProfile
							goalInfo={goalInfo}
							handleClose={handleEditGoalClose}
						/>
					)}
				</Modal.Body>
			</Modal>
		</>
	);
};

export default Profile;
