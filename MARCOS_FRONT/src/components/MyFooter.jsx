import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function MyFooter() {
  const floatingIcons = [
    { icon: "🧁", style: { top: "10px", left: "10px", fontSize: "24px", animationDelay: "0s" } },
    { icon: "🍪", style: { top: "20px", right: "20px", fontSize: "28px", animationDelay: "2s" } },
    { icon: "🎂", style: { bottom: "20px", left: "30px", fontSize: "26px", animationDelay: "4s" } },
    { icon: "🍰", style: { bottom: "10px", right: "40px", fontSize: "24px", animationDelay: "1s" } },
  ];

  return (
    <footer style={{ position: "relative", overflow: "hidden" }}>
      <style>
        {`
          .floating-icon {
            position: absolute;
            animation: float 6s ease-in-out infinite;
          }

          @keyframes float {
            0% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-10px) rotate(10deg); }
            50% { transform: translateY(0) rotate(0deg); }
            75% { transform: translateY(10px) rotate(-10deg); }
            100% { transform: translateY(0) rotate(0deg); }
          }

          .social-icon i {
            transition: transform 0.3s ease, color 0.3s ease;
            display: inline-block;
          }

          .social-icon i:hover {
            transform: scale(1.5);
            color: #D63447 !important;
          }

          .footer-link {
            color: #333;
            text-decoration: none;
            transition: color 0.3s ease;
          }

          .footer-link:hover {
            color: #D63447;
          }
        `}
      </style>

      <div style={{ backgroundColor: "#FDE2E4", color: "#333", padding: "50px 0", position: "relative" }}>
        <Container>
          <Row className="mb-4">
            <Col md={3} className="mb-3 text-center text-md-start">
              <h3 className="fw-bold" style={{ color: "#D63447" }}>D'Julia</h3>
              <p>Av. Aviación 2852<br />San Borja 15036, Lima - Perú</p>
            </Col>

            <Col md={3} className="mb-3 text-center text-md-start">
              <h5 className="fw-bold" style={{ color: "#D63447" }}>INFORMACIÓN</h5>
              <ul className="list-unstyled">
                <li><Link to="/privacidad" className="footer-link">Políticas de Privacidad</Link></li>
                <li><Link to="/reclamaciones" className="footer-link">Libro de Reclamaciones</Link></li>
                <li><Link to="/terminos" className="footer-link">Términos y Condiciones</Link></li>
              </ul>
            </Col>

            <Col md={3} className="mb-3 text-center text-md-start">
              <h5 className="fw-bold" style={{ color: "#D63447" }}>CONTACTO</h5>
              <p>Central: +01 237 7980</p>
              <p>Afiliaciones: 201 217 0928</p>
              <p>Flota: +01 237 7980</p>
              <p>Email: DJulia@gmail.com</p>
            </Col>

            <Col md={3} className="mb-3 text-center text-md-start">
              <h5 className="fw-bold" style={{ color: "#D63447" }}>PLATAFORMAS</h5>
              <p>Búscanos en:</p>
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  width="150"
                  style={{ borderRadius: "10px" }}
                />
              </a>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col className="text-center">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-dark social-icon">
                <i className="bi bi-facebook fs-4"></i>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-dark social-icon">
                <i className="bi bi-twitter fs-4"></i>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-dark social-icon">
                <i className="bi bi-instagram fs-4"></i>
              </a>
              <a href="https://pe.linkedin.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-dark social-icon">
                <i className="bi bi-linkedin fs-4"></i>
              </a>
            </Col>
          </Row>
        </Container>

        {floatingIcons.map((item, index) => (
          <span
            key={index}
            className="floating-icon"
            style={{ ...item.style, animationDelay: item.style.animationDelay }}
          >
            {item.icon}
          </span>
        ))}
      </div>

      <div style={{ backgroundColor: "#D63447", color: "#fff", padding: "15px 0", textAlign: "center" }}>
        <Container>
          <small>© 2025 D'Julia. Todos los Derechos Reservados</small>
        </Container>
      </div>
    </footer>
  );
}

export default MyFooter;