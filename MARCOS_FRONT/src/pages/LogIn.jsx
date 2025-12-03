import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function LogIn() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loginCliente } = useAuth();
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginCliente(correo, password);
      navigate("/profile");
    } catch (error) {}
  };

  const linkHoverStyle = {
    color: "#ff66aa",
    transform: "scale(1.05)",
    transition: "color 0.3s, transform 0.2s",
  };

  const linkDefaultStyle = {
    color: "#d63384",
    transition: "color 0.3s, transform 0.2s",
  };

  return (
    <>
      <HeroSection
        title="Iniciar Sesión"
        subtitle="Accede a tu cuenta"
        description="Bienvenido a nuestra pastelería online. Disfruta de nuestras deliciosas creaciones."
        background="src/assets/PastelHero.jpg"
        height="80vh"
        align="center"
        backgroundPosition="center top"
      />

      <section
        className="py-5"
        style={{ backgroundColor: "#ffe6f0", color: "#5c1a3d" }}
      >
        <div className="container">
          <h2 className="text-center mb-4">Bienvenido de nuevo</h2>
          <form
            className="mx-auto"
            style={{ maxWidth: "500px" }}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            <div className="input-group mb-3">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="input-group-text"
                role="button"
                onClick={togglePassword}
                style={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  transform: "scale(1)",
                }}
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
                    className="lucide lucide-eye-off"
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
                    className="lucide lucide-eye"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </span>
            </div>

            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: "#ff99cc",
                color: "#fff",
                width: "100%",
                marginTop: "1rem",
                transition: "background-color 0.3s, transform 0.2s",
              }}
              onClick={handleLogin} // <- Llama a loginCliente
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ff66aa";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ff99cc";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Entrar
            </button>

            <div className="text-center mt-3">
              <small>
                ¿No tienes cuenta?{" "}
                <Link
                  to="/register"
                  className="text-decoration-none"
                  style={linkDefaultStyle}
                  onMouseEnter={(e) =>
                    Object.assign(e.currentTarget.style, linkHoverStyle)
                  }
                  onMouseLeave={(e) =>
                    Object.assign(e.currentTarget.style, linkDefaultStyle)
                  }
                >
                  Regístrate aquí
                </Link>
              </small>
            </div>

            <div className="text-center mt-3">
              <Link
                to="/login-admin"
                className="text-decoration-none"
                style={linkDefaultStyle}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, linkHoverStyle)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.currentTarget.style, linkDefaultStyle)
                }
              >
                Iniciar como Administrador
              </Link>
            </div>

            <div className="text-center mt-2">
              <Link
                to="/login-vendedor"
                className="text-decoration-none"
                style={linkDefaultStyle}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, linkHoverStyle)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.currentTarget.style, linkDefaultStyle)
                }
              >
                Iniciar como Vendedor
              </Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default LogIn;