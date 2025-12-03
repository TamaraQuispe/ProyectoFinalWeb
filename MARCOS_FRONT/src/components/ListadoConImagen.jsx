import { Container, Row, Col } from "react-bootstrap";

function ListaConImagen({ features, image, imageAlt = "", imagePosition = "right", title = "" }) {
  return (
    <section className="py-5" style={{ backgroundColor: "#FFF0F5" }}>
      <Container>
        <Row className="align-items-center text-dark flex-md-row">
          {image && imagePosition === "left" && (
            <Col md={6}>
              <img src={image} alt={imageAlt} className="img-fluid rounded shadow-sm" />
            </Col>
          )}

          <Col md={6}>
            <h1 className="mb-4" style={{ color: "#FF69B4" }}>{title}</h1>
            <ul className="list-unstyled text-start">
              {features.map((feature, index) => (
                <li key={index} className="d-flex align-items-start mb-3">
                  <i className={`bi ${feature.icon} text-warning me-3`} style={{ fontSize: "1.4rem" }}></i>
                  <span style={{ fontSize: "1.1rem" }}>{feature.text}</span>
                </li>
              ))}
            </ul>
          </Col>

          {image && imagePosition === "right" && (
            <Col md={6}>
              <img src={image} alt={imageAlt} className="img-fluid rounded shadow-sm" />
            </Col>
          )}
        </Row>
      </Container>
    </section>
  );
}

export default ListaConImagen;