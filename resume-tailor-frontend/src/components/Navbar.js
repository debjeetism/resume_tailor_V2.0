 
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";

	export default function Navbar() {
		const isLoggedIn = Boolean(localStorage.getItem("token"));
		const navigate = useNavigate();
		const handleLogout = () => {
			localStorage.removeItem("token");
			navigate("/");
			window.location.reload();
		};
		return (
			<nav className="navbar gradient-bg">
				<div className="navbar-content">
					<FaUserCircle className="navbar-icon" />
					<h1 className="navbar-title">Resume Tailor</h1>
					<div className="navbar-links">
						{isLoggedIn ? (
							<>
								<Link className="navbar-link" to="/dashboard">Dashboard</Link>
								<Link className="navbar-link" to="/history">History</Link>
								<button
									className="navbar-link navbar-logout"
									type="button"
									onClick={handleLogout}
								>
									Logout
								</button>
							</>
						) : (
							<>
								<Link className="navbar-link" to="/">Login</Link>
								<Link className="navbar-link" to="/register">Register</Link>
							</>
						)}
					</div>
				</div>
			</nav>
		);
	}

