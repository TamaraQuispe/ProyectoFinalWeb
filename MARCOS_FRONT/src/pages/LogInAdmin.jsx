import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../hooks/useAuth";

function LogInAdmin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(email, password);
      navigate("/admin");
    } catch (error) {}
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('src/assets/logins.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="container bg-white rounded-4 shadow-lg overflow-hidden"
        style={{ maxWidth: "900px", width: "90%" }}
      >
        <div className="row g-5">
          <div
            className="col-lg-5 d-flex flex-column justify-content-center align-items-center text-white p-4"
            style={{
              background: "#d5a55b",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <img
              src="src/assets/logo.ico"
              alt="Logo"
              style={{ width: "140px", marginBottom: "15px" }}
            />
            <h3 className="fw-bold text-center">Panel Administrativo</h3>
            <p className="text-center text-light mt-2">
              Gestiona usuarios, productos y pedidos fácilmente.
            </p>
          </div>

          <div className="col-lg-7 d-flex align-items-center justify-content-center p-4 bg-light">
            <div style={{ width: "100%", maxWidth: "400px" }}>
              <h4 className="text-center mb-4 fw-semibold text-dark">Iniciar Sesión</h4>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="admin@pasteleria.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="input-group mb-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-group-text"
                    role="button"
                    onClick={togglePassword}
                    style={{ cursor: "pointer" }}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.75 10.75 0 0 1 12 20.75a10.75 10.75 0 0 1-9.938-6.406M1 1l22 22"></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </span>
                </div>

                <button type="submit" className="btn btn-dark w-100 mb-3">
                  Ingresar
                </button>
                <p className="text-center text-muted" style={{ fontSize: "0.9rem" }}>
                  Acceso exclusivo para administradores
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogInAdmin;