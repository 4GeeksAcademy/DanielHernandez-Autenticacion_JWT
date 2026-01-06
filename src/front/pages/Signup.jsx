import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Signup = () => {
    // Estado local para entradas controladas
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Maneja el registro de usuarios
    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/signup`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            }
        );

        if (!response.ok) {
            alert("Registration failed");
            return;
        }

        // Borrar formulario y redirigir para iniciar sesión
        setEmail("");
        setPassword("");
        navigate("/login");
    };

    return (
        <div className="container-sm w-25 p-3">
            <h1>Sign Up</h1>

            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <label className="mt-3">Password</label>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <button className="btn btn-primary mt-3 w-100">
                    Create account
                </button>

                <Link to="/login" className="d-block mt-3">
                    Already have an account?
                </Link>
            </form>
        </div>
    );
};
