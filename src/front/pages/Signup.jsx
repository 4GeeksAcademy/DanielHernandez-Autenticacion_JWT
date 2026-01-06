import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Signup = () => {
    // Estado local para entradas controladas
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    // Maneja el registro de usuarios
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMsg("");
        setIsSubmitting(true);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined");

            const response = await fetch(`${backendUrl}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setErrorMsg(data?.msg || "Registration failed");
                return;
            }

            // Borrar formulario
            setEmail("");
            setPassword("");

            // Redirigir al login tras crear usuario
            navigate("/login");
        } catch (err) {
            setErrorMsg(err?.message || "Unexpected error");
        } finally {
            setIsSubmitting(false);
        }
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

                {errorMsg && (
                    <div className="alert alert-danger mt-3 mb-0">
                        {errorMsg}
                    </div>
                )}

                <button className="btn btn-primary mt-3 w-100" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create account"}
                </button>

                <Link to="/login" className="d-block mt-3">
                    Already have an account?
                </Link>
            </form>
        </div>
    );
};
