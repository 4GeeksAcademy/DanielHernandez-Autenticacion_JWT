import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const navigate = useNavigate();

    const logout = () => {
        sessionStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        // Redirije usuarios sin identificar
        if (!token) {
            navigate("/login");
        }
    }, []);

    return (
        <div className="container-sm w-25">
            <div className="row justify-content-md-center">
                <h1 className="my-4">Acceso Autorizado</h1>
                <button onClick={logout} className="btn btn-primary">Cerrar sesión</button>
            </div>
        </div>
    );
};