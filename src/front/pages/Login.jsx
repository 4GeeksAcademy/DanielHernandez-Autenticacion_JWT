import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";


export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            }
        );

        if (!response.ok) {
            alert("Invalid credentials");
            return;
        }

        const data = await response.json();

        // Almacene el token JWT para rutas protegidas
        sessionStorage.setItem("token", data.token);

        navigate("/private");
    };


    return (
        <div className="container-sm w-25 p-3">
            <h1>Iniciar Sesión</h1>
            <form className="row justify-content-md-center" onSubmit={handleSubmit}>
                <div className="col-12">
                    <label htmlFor="inputEmail4" className="form-label">Email</label>
                    <input type="email" className="form-control" id="inputEmail4" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="col-12">
                    <label htmlFor="inputPassword4" className="form-label">Password</label>
                    <input type="password" className="form-control" id="inputPassword4" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="col-12 my-3">
                    <button type="submit" className="btn btn-primary px-5">Entrar</button>
                </div>
                <div className="col-12 my-3">
                    <Link to={"/Signup"} className="" >Registrarse</Link>
                </div>


            </form>
        </div>

    )
}
