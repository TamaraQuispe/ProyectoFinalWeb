import { useState, useEffect } from "react";
import { usePedidosVendedor } from "../../hooks/usePedidosVendedor";
import { Card, Button, Modal, Form, Spinner, Badge, ButtonGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { API_URL } from "../../services/api";

export default function VerificarPagos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalRechazo, setShowModalRechazo] = useState(false);
  const [showModalComprobante, setShowModalComprobante] = useState(false);
  const [comprobanteSeleccionado, setComprobanteSeleccionado] = useState(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [procesandoId, setProcesandoId] = useState(null);
  const [filtroTipoEntrega, setFiltroTipoEntrega] = useState("TODOS");

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const { data } = await usePedidosVendedor.listarTodos();
      
      const pedidosPendientes = data.filter(
        (pedido) => pedido.estadoPago === "PENDIENTE_VERIFICACION"
      );
      
      setPedidos(pedidosPendientes);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const handleVerificarPago = async (pedidoId) => {
    try {
      setProcesandoId(pedidoId);
      await usePedidosVendedor.verificarPago(pedidoId);
      await cargarPedidos();
    } catch (error) {
      console.error("Error al verificar pago:", error);
    } finally {
      setProcesandoId(null);
    }
  };

  const abrirModalRechazo = (pedido) => {
    setPedidoSeleccionado(pedido);
    setMotivoRechazo("");
    setShowModalRechazo(true);
  };

  const abrirModalComprobante = (comprobante) => {
    setComprobanteSeleccionado(comprobante);
    setShowModalComprobante(true);
  };

  const handleRechazarPago = async () => {
    if (!motivoRechazo.trim()) {
      toast.warning("Debes ingresar un motivo de rechazo");
      return;
    }

    try {
      setProcesandoId(pedidoSeleccionado.id);
      await usePedidosVendedor.rechazarPago(pedidoSeleccionado.id, motivoRechazo);
      setShowModalRechazo(false);
      setMotivoRechazo("");
      setPedidoSeleccionado(null);
      await cargarPedidos();
    } catch (error) {
      console.error("Error al rechazar pago:", error);
    } finally {
      setProcesandoId(null);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    if (filtroTipoEntrega === "TODOS") return true;
    return pedido.tipoEntrega === filtroTipoEntrega;
  });

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
        <p className="mt-3 text-muted fs-5">Cargando pedidos pendientes...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center bg-white p-4 rounded-3 shadow-sm">
            <div>
              <h2 className="mb-1" style={{ color: "#2c3e50", fontWeight: "600" }}>Verificación de Pagos</h2>
              <p className="text-muted mb-0">Gestión de comprobantes pendientes</p>
            </div>
            <Badge bg="primary" className="fs-4 px-4 py-3" style={{ backgroundColor: "#3498db" }}>
              {pedidosFiltrados.length}
            </Badge>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-white p-3 rounded-3 shadow-sm">
            <ButtonGroup className="w-100">
              <Button
                variant={filtroTipoEntrega === "TODOS" ? "primary" : "outline-primary"}
                onClick={() => setFiltroTipoEntrega("TODOS")}
                className="py-2"
                style={filtroTipoEntrega === "TODOS" ? { backgroundColor: "#3498db", borderColor: "#3498db" } : {}}
              >
                Todos ({pedidos.length})
              </Button>
              <Button
                variant={filtroTipoEntrega === "DELIVERY" ? "primary" : "outline-primary"}
                onClick={() => setFiltroTipoEntrega("DELIVERY")}
                className="py-2"
                style={filtroTipoEntrega === "DELIVERY" ? { backgroundColor: "#3498db", borderColor: "#3498db" } : {}}
              >
                Delivery ({pedidos.filter(p => p.tipoEntrega === "DELIVERY").length})
              </Button>
              <Button
                variant={filtroTipoEntrega === "RECOJO_TIENDA" ? "primary" : "outline-primary"}
                onClick={() => setFiltroTipoEntrega("RECOJO_TIENDA")}
                className="py-2"
                style={filtroTipoEntrega === "RECOJO_TIENDA" ? { backgroundColor: "#3498db", borderColor: "#3498db" } : {}}
              >
                Recojo en Tienda ({pedidos.filter(p => p.tipoEntrega === "RECOJO_TIENDA").length})
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>

      {pedidosFiltrados.length === 0 ? (
        <div className="row">
          <div className="col-12">
            <div className="bg-white p-5 rounded-3 shadow-sm text-center">
              <div className="mb-3" style={{ fontSize: "4rem", color: "#95a5a6" }}>✓</div>
              <h4 style={{ color: "#2c3e50" }}>No hay pagos pendientes</h4>
              <p className="text-muted">Todos los comprobantes han sido procesados correctamente</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {pedidosFiltrados.map((pedido) => (
            <div key={pedido.id} className="col-12 col-xl-6">
              <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
                <Card.Header className="border-0 py-3" style={{ backgroundColor: "#34495e" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-white fw-bold fs-5">Pedido #{pedido.id}</span>
                    <Badge 
                      bg="light" 
                      text="dark" 
                      className="px-3 py-2"
                      style={{ fontSize: "0.9rem", fontWeight: "500" }}
                    >
                      {pedido.tipoEntrega === "DELIVERY" ? "Delivery" : "Recojo en Tienda"}
                    </Badge>
                  </div>
                </Card.Header>

                <Card.Body className="p-4">
                  <div className="row mb-4">
                    <div className="col-md-7 mb-3 mb-md-0">
                      <h6 className="text-uppercase fw-bold mb-3" style={{ color: "#7f8c8d", fontSize: "0.85rem", letterSpacing: "1px" }}>
                        Información del Cliente
                      </h6>
                      <div className="mb-2">
                        <span className="text-muted" style={{ fontSize: "0.9rem" }}>Nombre:</span>
                        <span className="ms-2 fw-semibold" style={{ color: "#2c3e50" }}>
                          {pedido.usuario.nombre} {pedido.usuario.apellido}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-muted" style={{ fontSize: "0.9rem" }}>Celular:</span>
                        <span className="ms-2" style={{ color: "#2c3e50" }}>{pedido.usuario.celular}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-muted" style={{ fontSize: "0.9rem" }}>Email:</span>
                        <span className="ms-2" style={{ color: "#2c3e50" }}>{pedido.usuario.correo}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-muted" style={{ fontSize: "0.9rem" }}>Fecha:</span>
                        <span className="ms-2" style={{ color: "#2c3e50" }}>{formatearFecha(pedido.fechaPedido)}</span>
                      </div>
                      <div className="mt-3 p-3 rounded" style={{ backgroundColor: "#ecf0f1" }}>
                        <div className="text-center">
                          <span className="text-muted d-block mb-1" style={{ fontSize: "0.85rem" }}>Total del Pedido</span>
                          <span className="fw-bold fs-3" style={{ color: "#27ae60" }}>S/ {pedido.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-5">
                      <h6 className="text-uppercase fw-bold mb-3" style={{ color: "#7f8c8d", fontSize: "0.85rem", letterSpacing: "1px" }}>
                        Comprobante de Pago
                      </h6>
                      <div className="mb-3">
                        <span className="text-muted" style={{ fontSize: "0.9rem" }}>Número Yape:</span>
                        <span className="ms-2 fw-semibold" style={{ color: "#2c3e50" }}>{pedido.numeroYape}</span>
                      </div>
                      <div className="text-center">
                        <div 
                          className="border rounded p-2 mb-3" 
                          style={{ backgroundColor: "#f8f9fa", height: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <img
                            src={`${API_URL}${pedido.comprobanteYape}`}
                            alt="Miniatura"
                            className="img-fluid rounded"
                            style={{ maxHeight: "160px", objectFit: "contain" }}
                          />
                        </div>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="w-100"
                          onClick={() => abrirModalComprobante(pedido.comprobanteYape)}
                          style={{ borderColor: "#3498db", color: "#3498db" }}
                        >
                          Ver Comprobante
                        </Button>
                      </div>
                    </div>
                  </div>

                  {pedido.tipoEntrega === "DELIVERY" && (
                    <div className="mb-4 p-3 rounded" style={{ backgroundColor: "#ecf0f1" }}>
                      <h6 className="text-uppercase fw-bold mb-3" style={{ color: "#7f8c8d", fontSize: "0.85rem", letterSpacing: "1px" }}>
                        Información de Entrega
                      </h6>
                      <div className="mb-2">
                        <span className="text-muted" style={{ fontSize: "0.9rem" }}>Dirección:</span>
                        <span className="ms-2" style={{ color: "#2c3e50" }}>{pedido.direccionEntrega}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-muted" style={{ fontSize: "0.9rem" }}>Teléfono:</span>
                        <span className="ms-2" style={{ color: "#2c3e50" }}>{pedido.telefonoContacto}</span>
                      </div>
                      {pedido.referencia && (
                        <div className="mb-2">
                          <span className="text-muted" style={{ fontSize: "0.9rem" }}>Referencia:</span>
                          <span className="ms-2" style={{ color: "#2c3e50" }}>{pedido.referencia}</span>
                        </div>
                      )}
                      {pedido.observaciones && (
                        <div>
                          <span className="text-muted" style={{ fontSize: "0.9rem" }}>Observaciones:</span>
                          <span className="ms-2" style={{ color: "#2c3e50" }}>{pedido.observaciones}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <h6 className="text-uppercase fw-bold mb-3" style={{ color: "#7f8c8d", fontSize: "0.85rem", letterSpacing: "1px" }}>
                      Detalle del Pedido ({pedido.detalles.length} productos)
                    </h6>
                    <div className="table-responsive">
                      <table className="table table-sm table-hover mb-0">
                        <thead style={{ backgroundColor: "#ecf0f1" }}>
                          <tr>
                            <th className="border-0 py-2" style={{ color: "#7f8c8d", fontSize: "0.85rem" }}>Producto</th>
                            <th className="border-0 py-2 text-center" style={{ color: "#7f8c8d", fontSize: "0.85rem" }}>Cant.</th>
                            <th className="border-0 py-2 text-end" style={{ color: "#7f8c8d", fontSize: "0.85rem" }}>Precio</th>
                            <th className="border-0 py-2 text-end" style={{ color: "#7f8c8d", fontSize: "0.85rem" }}>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pedido.detalles.map((detalle) => (
                            <tr key={detalle.id}>
                              <td className="py-2" style={{ color: "#2c3e50" }}>{detalle.producto.nombre}</td>
                              <td className="text-center py-2" style={{ color: "#2c3e50" }}>{detalle.cantidad}</td>
                              <td className="text-end py-2" style={{ color: "#2c3e50" }}>S/ {detalle.precioUnitario.toFixed(2)}</td>
                              <td className="text-end py-2 fw-semibold" style={{ color: "#2c3e50" }}>S/ {detalle.subtotal.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card.Body>

                <Card.Footer className="border-0 p-3" style={{ backgroundColor: "#f8f9fa" }}>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-danger"
                      className="flex-grow-1"
                      onClick={() => abrirModalRechazo(pedido)}
                      disabled={procesandoId === pedido.id}
                      style={{ borderWidth: "2px" }}
                    >
                      {procesandoId === pedido.id ? (
                        <>
                          <Spinner size="sm" animation="border" className="me-2" />
                          Procesando...
                        </>
                      ) : (
                        "Rechazar"
                      )}
                    </Button>
                    <Button
                      className="flex-grow-1"
                      onClick={() => handleVerificarPago(pedido.id)}
                      disabled={procesandoId === pedido.id}
                      style={{ backgroundColor: "#27ae60", borderColor: "#27ae60", fontWeight: "600" }}
                    >
                      {procesandoId === pedido.id ? (
                        <>
                          <Spinner size="sm" animation="border" className="me-2" />
                          Procesando...
                        </>
                      ) : (
                        "Verificar Pago"
                      )}
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>
      )}

      <Modal 
        show={showModalComprobante} 
        onHide={() => setShowModalComprobante(false)} 
        centered 
        size="lg"
      >
        <Modal.Header closeButton className="border-0" style={{ backgroundColor: "#34495e" }}>
          <Modal.Title className="text-white">Comprobante de Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center" style={{ backgroundColor: "#2c3e50" }}>
          <img
            src={`${API_URL}${comprobanteSeleccionado}`}
            alt="Comprobante"
            className="img-fluid rounded"
            style={{ maxHeight: "70vh", width: "auto" }}
          />
        </Modal.Body>
        <Modal.Footer className="border-0" style={{ backgroundColor: "#34495e" }}>
          <Button 
            variant="light" 
            onClick={() => setShowModalComprobante(false)}
          >
            Cerrar
          </Button>
          <Button
            style={{ backgroundColor: "#3498db", borderColor: "#3498db" }}
            onClick={() => window.open(`${API_URL}${comprobanteSeleccionado}`, "_blank")}
          >
            Descargar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal 
        show={showModalRechazo} 
        onHide={() => setShowModalRechazo(false)} 
        centered
      >
        <Modal.Header closeButton className="border-0" style={{ backgroundColor: "#e74c3c" }}>
          <Modal.Title className="text-white">Rechazar Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p style={{ color: "#2c3e50" }}>
            ¿Estás seguro de rechazar el pago del <strong>Pedido #{pedidoSeleccionado?.id}</strong>?
          </p>
          <Form.Group>
            <Form.Label className="fw-semibold" style={{ color: "#2c3e50" }}>Motivo del rechazo *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Ej: Comprobante ilegible, monto incorrecto, datos inconsistentes..."
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              style={{ resize: "none" }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0" style={{ backgroundColor: "#f8f9fa" }}>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowModalRechazo(false)}
            disabled={procesandoId === pedidoSeleccionado?.id}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleRechazarPago} 
            disabled={procesandoId === pedidoSeleccionado?.id}
            style={{ backgroundColor: "#e74c3c", borderColor: "#e74c3c" }}
          >
            {procesandoId === pedidoSeleccionado?.id ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Rechazando...
              </>
            ) : (
              "Confirmar Rechazo"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}