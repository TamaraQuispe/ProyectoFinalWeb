import { Card, Button } from "react-bootstrap";

export default function ProductCard({
  nombre,
  categoria,
  descripcion,
  imagen,
  precio,
  stock,
  onAgregarCarrito,
}) {
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock < 5;

  const cardStyle = {
    backgroundColor: isOutOfStock ? "#e0e0e0" : "#fffaf5",
    opacity: isOutOfStock ? 0.6 : 1,
    border: isLowStock ? "2px solid #ff4d4d" : "none",
    position: "relative",
    transition: "all 0.3s ease",
  };

  const ribbonText = isOutOfStock
    ? "AGOTADO"
    : isLowStock
    ? "¡YA SE ACABA!"
    : null;

  const buttonText = isOutOfStock ? "Agotado" : "Agregar al carrito";
  const buttonDisabled = isOutOfStock;

  return (
    <Card className="h-100 shadow-sm product-card" style={cardStyle}>
      {ribbonText && (
        <div
          className={`ribbon-circle ${
            isOutOfStock ? "ribbon-red" : "ribbon-yellow"
          }`}
        >
          {ribbonText}
        </div>
      )}

      <div className="image-container">
        <Card.Img
          variant="top"
          src={imagen}
          alt={nombre}
          className="img-fluid rounded-top"
        />
      </div>

      <Card.Body className="d-flex flex-column text-center">
        <Card.Title className="fw-bold text-brown fs-5 mb-1">{nombre}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{categoria}</Card.Subtitle>
        <Card.Text className="text-muted flex-grow-1 small">{descripcion}</Card.Text>

        <div className="mb-2">
          <span className="fw-bold fs-5 text-brown">S/ {precio.toFixed(2)}</span>
        </div>

        <p
          className={`small ${
            isOutOfStock ? "text-danger" : isLowStock ? "text-warning" : "text-success"
          }`}
        >
          {isOutOfStock
            ? "Sin stock"
            : isLowStock
            ? `Últimas unidades: ${stock}`
            : `Disponibles: ${stock}`}
        </p>

        <Button
          variant="warning"
          className="w-100 mt-auto text-white fw-semibold product-button"
          onClick={onAgregarCarrito}
          disabled={buttonDisabled}
          style={{
            backgroundColor: isOutOfStock ? "#999" : "#d28f56",
            border: "none",
            cursor: buttonDisabled ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
          }}
        >
          {buttonText}
        </Button>
      </Card.Body>

      <style>
        {`
          .product-card { border-radius: 15px; overflow: visible; }
          .product-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
          .product-card .image-container { background-color: #fff3e0; display: flex; align-items: center; justify-content: center; padding: 0.5rem; }
          .product-card img { border-radius: 12px; transition: transform 0.3s ease; height: 150px; object-fit: cover; }
          .product-card:hover img { transform: scale(1.05); }
          .text-brown { color: #7b3f00; }
          .ribbon-circle { position: absolute; top: -12px; right: -12px; width: 70px; height: 70px; border-radius: 50%; color: white; font-weight: bold; font-size: 0.8rem; text-align: center; display: flex; align-items: center; justify-content: center; }
          .ribbon-red { background-color: #ff4d4d; }
          .ribbon-yellow { background-color: #ffcc00; }
          .product-button:hover { transform: translateY(-2px); background-color: #c7793f !important; }
        `}
      </style>
    </Card>
  );
}