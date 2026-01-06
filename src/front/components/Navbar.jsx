import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export const Navbar = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// Recalcula si hay token cada vez que cambie la ruta.
	// Esto hace que al navegar tras hacer login, el navbar se actualice.
	useEffect(() => {
		const token = sessionStorage.getItem("token");
		setIsLoggedIn(!!token);
	}, [location.pathname]);

	// escucha cambios en sessionStorage
	// Actualiza el NAv si el token cambia en otra pestaña
	useEffect(() => {
		const onStorageChange = () => {
			const token = sessionStorage.getItem("token");
			setIsLoggedIn(!!token);
		};

		window.addEventListener("storage", onStorageChange);

		return () => {
			window.removeEventListener("storage", onStorageChange);
		};
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
