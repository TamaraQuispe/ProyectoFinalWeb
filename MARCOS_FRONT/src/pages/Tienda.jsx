import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { useProductos } from "../hooks/useProductos";
import { useCategories } from "../hooks/useCategories";

export default function Tienda() {
  const { productos, fetchProductos, loading: loadingProductos } = useProductos();
  const { categorias, fetchCategorias, loading: loadingCategorias } = useCategories();
  const { carrito, setCarrito } = useOutletContext();

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [isPortrait, setIsPortrait] = useState(window.matchMedia("(orientation: portrait)").matches);
  const [toastActivo, setToastActivo] = useState(false);

  useEffect(() => {
    fetchProductos().catch(err => console.error(err));
    fetchCategorias().catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const handle = e => setIsPortrait(e.matches);
    const mq = window.matchMedia("(orientation: portrait)");
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  const handleAgregarCarrito = (producto) => {
    const existe = carrito.find(item => item.id === producto.id);
    let actualizado;

    if (existe) {
      if (existe.cantidad + 1 > producto.stock) {
        if (!toastActivo) {
          setToastActivo(true);
          toast.error(`No puedes superar el stock disponible de ${producto.nombre}`, { onClose: () => setToastActivo(false) });
        }
        return;
      }
      actualizado = carrito.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
    } else {
      if (producto.stock < 1) {
        if (!toastActivo) {
          setToastActivo(true);
          toast.error(`No hay stock disponible de ${producto.nombre}`, { onClose: () => setToastActivo(false) });
        }
        return;
      }
      actualizado = [...carrito, { ...producto, cantidad: 1 }];
    }

    setCarrito(actualizado);
    localStorage.setItem("carrito", JSON.stringify(actualizado));
  };

  const productosFiltrados = categoriaSeleccionada 
    ? productos.filter(p => p.categoria.id === categoriaSeleccionada) 
    : productos;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(rgba(255,245,230,0.92), rgba(255,245,230,0.92)), url('https://img.freepik.com/vector-premium/patron-costuras-elementos-panaderia-pasteleria-postre-fondo-doodle-vectorial_647682-248.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        paddingTop: "100px",
        paddingBottom: "80px",
      }}
    >
      <Container>
        <Row className="justify-content-center mb-4 text-center">
          <Col lg={8}>
            <h2 className="fw-bold text-brown mb-3">Nuestra Pastelería</h2>
            <p className="text-muted">Disfruta de nuestras delicias artesanales hechas con amor y los mejores ingredientes.</p>
          </Col>
        </Row>

        <Row>
          <Col md={3} className="mb-4">
            <div
              className="p-3 rounded shadow-sm bg-cream"
              style={{ position: "sticky", top: "110px", border: "2px solid #f4d1a1" }}
            >
              <h5 className="fw-bold text-brown mb-3">Categorías</h5>
              <ListGroup variant="flush">
                <ListGroup.Item
                  action
                  active={categoriaSeleccionada === null}
                  onClick={() => setCategoriaSeleccionada(null)}
                  className="category-item"
                >
                  Todos
                </ListGroup.Item>

                {categorias.map((c) => (
                  <ListGroup.Item
                    key={c.id}
                    action
                    active={categoriaSeleccionada === c.id}
                    onClick={() => setCategoriaSeleccionada(c.id)}
                    className="category-item"
                  >
                    {c.nombre}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>

          <Col md={9}>
            {loadingProductos || loadingCategorias ? (
              <p>Cargando productos y categorías...</p>
            ) : (
              <Row xs={1} sm={2} md={isPortrait ? 3 : 4} className="g-4 justify-content-center align-items-stretch">
                {productosFiltrados.map((producto) => (
                  <Col key={producto.id} className="d-flex justify-content-center" style={{ maxWidth: "260px" }}>
                    <ProductCard
                      nombre={producto.nombre}
                      categoria={producto.categoria.nombre}
                      descripcion={producto.descripcion}
                      imagen={producto.imagen}
                      precio={producto.precio}
                      stock={producto.stock}
                      onAgregarCarrito={() => handleAgregarCarrito(producto)}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>

      <style>
        {`
          .text-brown { color: #7b3f00; }
          .bg-cream { background-color: #fff7ed; }
          .category-item { background-color: #fff7ed; border: none; transition: background-color 0.3s ease; }
          .category-item:hover { background-color: #ffe5b4; }
          .list-group-item.active { background-color: #d28f56 !important; border-color: #d28f56 !important; color: white !important; }
        `}
      </style>
    </div>
  );
}