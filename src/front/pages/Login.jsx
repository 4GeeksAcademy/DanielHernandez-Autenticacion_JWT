import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMsg("");
        setIsSubmitting(true);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined");

            // Manda credenciales al backend
            const response = await fetch(`${backendUrl}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                setErrorMsg(data?.msg || "Invalid credentials");
                return;
            }

            // Guarda el token JWT para rutas protegidas
            sessionStorage.setItem("token", data.token);

            // Redirige a una pagina privada
            navigate("/private");
        } catch (err) {
            setErrorMsg(err?.message || "Unexpected error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container-sm w-25 p-3">
            <h1>Iniciar Sesión</h1>

            <form className="row justify-content-md-center" onSubmit={handleSubmit}>
                <div className="col-12">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="col-12 mt-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {errorMsg && (
                    <div className="col-12 mt-3">
                        <div className="alert alert-danger mb-0">{errorMsg}</div>
                    </div>
                )}

                <div className="col-12 my-3">
                    <button type="submit" className="btn btn-primary px-5" disabled={isSubmitting}>
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </button>
                </div>

                <div className="col-12 my-2">
                    <Link to="/signup">Create an account</Link>
                </div>
            </form>
        </div>
    );
};
