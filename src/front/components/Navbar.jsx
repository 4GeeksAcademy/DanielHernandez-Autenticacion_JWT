import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const Navbar = () => {
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		// Comprobación simple: si hay token, consideramos logueado
		const token = sessionStorage.getItem("token");
		setIsLoggedIn(!!token);
	}, []);

	const handleLogout = () => {
		sessionStorage.removeItem("token");
		setIsLoggedIn(false);
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/" className="text-decoration-none">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>

				<div className="ms-auto d-flex gap-2">
					<Link to="/demo">
						<button className="btn btn-outline-primary">Demo</button>
					</Link>

					{isLoggedIn ? (
						<>
							<Link to="/private">
								<button className="btn btn-primary">Private</button>
							</Link>
							<button className="btn btn-secondary" onClick={handleLogout}>
								Logout
							</button>
						</>
					) : (
						<>
							<Link to="/login">
								<button className="btn btn-primary">Login</button>
							</Link>
							<Link to="/signup">
								<button className="btn btn-outline-secondary">Signup</button>
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};
