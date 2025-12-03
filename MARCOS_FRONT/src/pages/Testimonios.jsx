import React from "react";
import HeroSection from "../components/HeroSection";
import CardDescrip from "../components/CardConDescripcion";
import { Container, Row, Col } from "react-bootstrap";

function Testimonios() {
  const testimoniosData = [
    {
      titulo: "María G.",
      descripcion: "¡Los pasteles son increíbles! Cada bocado es una explosión de sabor.",
      imagen: "src/assets/testimonio1.jpg",
    },
    {
      titulo: "Juan P.",
      descripcion: "El servicio es excelente y siempre cumplen con los pedidos a tiempo.",
      imagen: "src/assets/testimonio2.jpg",
    },
    {
      titulo: "Ana L.",
      descripcion: "Me encanta la creatividad en cada pastel. ¡Recomendados 100%!",
      imagen: "src/assets/testimonio3.jpg",
    },
    {
      titulo: "Carlos M.",
      descripcion: "El lugar perfecto para endulzar cualquier ocasión especial.",
      imagen: "src/assets/testimonio4.jpg",
    },
  ];

  return (
    <>
      <HeroSection
        title="Testimonios de Nuestros Clientes"
        subtitle="La dulzura que nos distingue"
        description="Descubre lo que nuestros clientes dicen sobre nuestros pasteles y servicios."
        background="src/assets/FondosTestimonios.jpg"
        height="60vh"
        align="center"
        backgroundPosition="center"
      />

      <section className="py-5" style={{ backgroundColor: "#fff0f5", color: "#5c1a3d" }}>
        <Container>
          <h2 className="text-center mb-5">Lo que dicen nuestros clientes</h2>
          <Row className="g-4">
            {testimoniosData.map((item, index) => (
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

export default Testimonios;