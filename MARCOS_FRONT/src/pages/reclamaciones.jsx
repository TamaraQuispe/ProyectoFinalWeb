import HeroSection from "../components/HeroSection";
import { Container, Button } from "react-bootstrap";

function Reclamaciones() {
  return (
    <>
      <HeroSection
        title="LIBRO DE RECLAMACIONES"
        subtitle="Tu opinión nos ayuda a seguir mejorando cada dulce momento."
        background="src/assets/FondoPasteleria.jpg"
        height="60vh"
        align="center"
        backgroundPosition="center top"
      />

      <section
        className="py-5"
        style={{
          backgroundColor: "#fff5ef",
          color: "#4a2c2a",
        }}
      >
        <Container className="text-center">
          <h2
            className="mb-4 fw-bold"
            style={{
              color: "#d97b66",
            }}
          >
            Libro de Reclamaciones
          </h2>

          <p className="mb-4">
            En <strong>Pastelería Djulia</strong> valoramos tus comentarios,
            sugerencias y reclamos. Conforme al Decreto Supremo N.º 101-2022-PCM,
            ponemos a tu disposición nuestro Libro de Reclamaciones digital para
            garantizar transparencia y confianza.
          </p>

          <p>
            Descarga el formato, complétalo y envíalo a nuestro correo oficial o
            entrégalo en cualquiera de nuestras tiendas. ¡Tu voz nos ayuda a
            endulzar cada experiencia!
          </p>

          <Button
            href="/Libro de Reclamaciones (generico).pdf"
            download="Libro-de-Reclamaciones-Djulia.pdf"
            style={{
              backgroundColor: "#d97b66",
              border: "none",
              color: "#fff",
              fontWeight: "bold",
              padding: "0.75rem 2rem",
              borderRadius: "50px",
              marginTop: "1.5rem",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#c1634e")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#d97b66")}
          >
            Descargar PDF
          </Button>
        </Container>
      </section>
    </>
  );
}

export default Reclamaciones;