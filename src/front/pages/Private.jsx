import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const navigate = useNavigate();

    const [status, setStatus] = useState("loading"); // loading | authorized | unauthorized
    const [user, setUser] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    const logout = () => {
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        // 1) Guard rápido: si no hay token, fuera
        if (!token) {
            navigate("/login");
            return;
        }

        // 2) Validación real con el backend
        const validateToken = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined");

                const resp = await fetch(`${backendUrl}/api/private`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await resp.json().catch(() => ({}));

                if (!resp.ok) {
                    // Token inválido/expirado o cualquier error -> logout
                    setStatus("unauthorized");
                    setErrorMsg(data?.msg || "No autorizado");
                    sessionStorage.removeItem("token");
                    navigate("/login");
                    return;
                }

                setUser(data?.usuario || null);
                setStatus("authorized");

            } catch (err) {
                setStatus("unauthorized");
                setErrorMsg(err?.message || "Error validando el token");
                sessionStorage.removeItem("token");
                navigate("/login");
            }
        };

        validateToken();
    }, [navigate]);

    if (status === "loading") {
        return (
            <div className="container-sm w-50 mt-5 text-center">
                <h3>Validando sesión...</h3>
                <p className="text-muted">Comprobando tu token con el backend.</p>
            </div>
        );
    }

    return (
        <div className="container-sm w-50 mt-5">
            <div className="row justify-content-md-center text-center">
                <h1 className="my-4">Acceso Autorizado</h1>

                {user && (
                    <div className="alert alert-success">
                        <div><strong>ID:</strong> {user.id}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                    </div>
                )}

                {errorMsg && (
                    <div className="alert alert-danger">
                        {errorMsg}
                    </div>
                )}

                <button onClick={logout} className="btn btn-primary">
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
};
