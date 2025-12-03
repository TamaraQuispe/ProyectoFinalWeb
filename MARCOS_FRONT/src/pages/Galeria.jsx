import React from "react";
import HeroSection from "../components/HeroSection";
import CardDescrip from "../components/CardConDescripcion";
import { Container, Row, Col } from "react-bootstrap";

function Galeria() {
  const galeriaData = [
    {
      titulo: "Feria de Pastelería 2023",
      descripcion: "Participamos en la feria local mostrando nuestras creaciones más innovadoras.",
      imagen: "src/assets/evento1.jpg",
    },
    {
      titulo: "Apoyo a Escuelas",
      descripcion: "Donamos pasteles y realizamos talleres para los niños de escuelas locales.",
      imagen: "src/assets/evento2.jpg",
    },
    {
      titulo: "Evento Corporativo",
      descripcion: "Endulzamos la inauguración de oficinas con nuestros pasteles personalizados.",
      imagen: "src/assets/evento3.jpg",
    },
    {
      titulo: "Campaña Solidaria",
      descripcion: "Colaboramos con fundaciones locales para llevar dulzura a quienes más lo necesitan.",
      imagen: "src/assets/evento4.jpg",
    },
  ];

  return (
    <>
      <HeroSection
        title="Galería de Eventos"
        subtitle="Compartimos nuestros momentos más dulces"
        description="Descubre los eventos, campañas y actividades donde nuestra pastelería ha dejado huella."
        background="src/assets/FondosGaleria.jpg"
        height="60vh"
        align="center"
        backgroundPosition="center"
      />

      <section className="py-5" style={{ backgroundColor: "#fff0f5", color: "#5c1a3d" }}>
        <Container>
          <h2 className="text-center mb-5">Eventos y Actividades</h2>
          <Row className="g-4">
            {galeriaData.map((item, index) => (
              <Col key={index} md={6} lg={3}>
                <CardDescrip
                  titulo={item.titulo}
                  descripcion={item.descripcion}
                  imagen={item.imagen}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Galeria;