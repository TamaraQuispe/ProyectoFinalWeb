import "bootstrap/dist/css/bootstrap.min.css";
import HeroSection from "../components/HeroSection";
import { useState } from "react";

function Contactanos() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <HeroSection
        title="Contáctanos"
        subtitle="¡Nos encanta escuchar de ti!"
        background="src/assets/PastelHero.jpg"
        height="70vh"
        align="center"
        backgroundPosition="center top"
      />

      <section className="py-5" style={{ backgroundColor: "#ffe6f0" }}>
        <div className="container">
          <h2 className="text-center mb-4 fw-bold" style={{ color: "#ff66b2" }}>
            Envíanos un mensaje
          </h2>

          <form
            className="mx-auto p-4 rounded-4 shadow-sm"
            style={{ maxWidth: "600px", backgroundColor: "#fff0f5" }}
            onSubmit={handleSubmit}
          >
            <div className="mb-3 text-start">
              <label className="form-label fw-semibold" style={{ color: "#ff3399" }}>
                Nombre
              </label>
              <input
                type="text"
                name="name"
                placeholder="Tu nombre"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                style={{
                  borderRadius: "8px",
                  borderColor: "#ffb3d9",
                  backgroundColor: "#fff0f5",
                }}
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label fw-semibold" style={{ color: "#ff3399" }}>
                Correo
              </label>
              <input
                type="email"
                name="email"
                placeholder="tuemail@gmail.com"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                style={{
                  borderRadius: "8px",
                  borderColor: "#ffb3d9",
                  backgroundColor: "#fff0f5",
                }}
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label fw-semibold" style={{ color: "#ff3399" }}>
                Mensaje
              </label>
              <textarea
                name="message"
                rows="4"
                placeholder="Escribe tu mensaje"
                className="form-control"
                value={formData.message}
                onChange={handleChange}
                style={{
                  borderRadius: "8px",
                  borderColor: "#ffb3d9",
                  backgroundColor: "#fff0f5",
                }}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn w-100 fw-bold py-2 mt-2"
              style={{
                background: "linear-gradient(90deg, #ff66b2 0%, #ff99cc 100%)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              Enviar
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Contactanos;