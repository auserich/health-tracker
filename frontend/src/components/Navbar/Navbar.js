import React from "react";

import {
	Button,
	Col,
	Container,
	Form,
	NavDropdown,
	Nav as NavReact,
	Row,
} from "react-bootstrap";
import { Navbar as NavbarReact } from "react-bootstrap";
import useHistory from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate();

	const handleSignOut = () => {
		localStorage.removeItem("jwtToken");
		localStorage.removeItem("username");
		navigate("/");
	};

	return (
		<NavbarReact expand="lg" className="bg-body-tertiary">
			<Container>
				<NavbarReact.Brand href="/main">
					[PH] Health Tracker
				</NavbarReact.Brand>
				<NavbarReact.Toggle aria-controls="basic-navbar-nav" />
				<NavbarReact.Collapse id="basic-navbar-nav">
					<Row className="w-100">
						<Col>
							<NavReact className="mr-auto">
								<NavReact.Link href="/meal">Meal</NavReact.Link>
								<NavReact.Link href="/water">
									Water
								</NavReact.Link>
								<NavReact.Link href="/exercise-tracker">
									Exercise
								</NavReact.Link>
								<NavReact.Link href="/sleep">
									Sleep
								</NavReact.Link>
								<NavReact.Link href="/profile">
									Profile
								</NavReact.Link>
							</NavReact>
						</Col>
						<Col className="d-flex justify-content-end">
							<NavbarReact.Text className="me-2">
								Signed in as: {localStorage.getItem("username")}
							</NavbarReact.Text>
							<Button onClick={handleSignOut}>Sign Out</Button>
						</Col>
					</Row>
				</NavbarReact.Collapse>
			</Container>
		</NavbarReact>
	);
};
