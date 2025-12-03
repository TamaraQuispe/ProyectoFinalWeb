import { useState, useEffect } from "react";
import { usePedidosVendedor } from "../../hooks/usePedidosVendedor";
import { Card, Button, Modal, Spinner, Badge, ButtonGroup } from "react-bootstrap";
import { Timeline } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, RocketOutlined, TruckOutlined, ShopOutlined, UserOutlined } from "@ant-design/icons";

export default function PedidosVendedor() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [filtroTipo, setFiltroTipo] = useState("TODOS");
  const [showModalHistorial, setShowModalHistorial] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [procesandoId, setProcesandoId] = useState(null);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      let result;
      if (filtroEstado !== "TODOS") {
        result = await usePedidosVendedor.listarPorEstado(filtroEstado);
      } else {
        result = await usePedidosVendedor.listarTodos();
      }
      const data = Array.isArray(result.data) ? result.data : [result.data];
      setPedidos(data);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, [filtroEstado]);

  const abrirModalHistorial = async (pedido) => {
    try {
      setPedidoSeleccionado(pedido);
      setShowModalHistorial(true);
      setCargandoHistorial(true);
      const result = await usePedidosVendedor.verHistorial(pedido.id);
      setHistorial(result.data || []);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setCargandoHistorial(false);
    }
  };

  const handleCambiarEstado = async (pedido) => {
    const { id, estado, tipoEntrega } = pedido;
    let nuevoEstado, observacion;

    if (estado === "POR_CONFIRMAR") {
      nuevoEstado = "CONFIRMADO";
      observacion = "Pedido confirmado, pago verificado";
    } else if (estado === "CONFIRMADO") {
      nuevoEstado = "EN_PREPARACION";
      observacion = "Preparando productos";
    } else if (estado === "EN_PREPARACION") {
      if (tipoEntrega === "RECOJO_TIENDA") {
        nuevoEstado = "LISTO_PARA_RECOGER";
        observacion = "Pedido listo para recoger";
      } else {
        nuevoEstado = "EN_CAMINO";
        observacion = "Pedido en camino";
      }
    } else if (estado === "LISTO_PARA_RECOGER" || estado === "EN_CAMINO") {
      nuevoEstado = "ENTREGADO";
      observacion = "Pedido entregado exitosamente";
    }

    if (nuevoEstado) {
      try {
        setProcesandoId(id);
        await usePedidosVendedor.cambiarEstado(id, nuevoEstado, observacion);
        await cargarPedidos();
      } catch (error) {
        console.error("Error al cambiar estado:", error);
      } finally {
        setProcesandoId(null);
      }
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

  const obtenerColorEstado = (estado) => {
    const colores = {
      POR_CONFIRMAR: "#e67e22",
      CONFIRMADO: "#3498db",
      EN_PREPARACION: "#9b59b6",
      LISTO_PARA_RECOGER: "#f39c12",
      EN_CAMINO: "#16a085",
      ENTREGADO: "#27ae60",
      CANCELADO: "#e74c3c"
    };
    return colores[estado] || "#95a5a6";
  };

  const obtenerTextoBoton = (estado, tipoEntrega) => {
    if (estado === "POR_CONFIRMAR") return "Confirmar Pedido";
    if (estado === "CONFIRMADO") return "Iniciar Preparación";
    if (estado === "EN_PREPARACION") {
      return tipoEntrega === "RECOJO_TIENDA" ? "Marcar Listo para Recoger" : "Enviar a Delivery";
    }
    if (estado === "LISTO_PARA_RECOGER" || estado === "EN_CAMINO") return "Marcar como Entregado";
    return null;
  };

  const obtenerIconoHistorial = (estado) => {
    const iconos = {
      POR_CONFIRMAR: <ClockCircleOutlined style={{ fontSize: "20px" }} />,
      CONFIRMADO: <CheckCircleOutlined style={{ fontSize: "20px" }} />,
      EN_PREPARACION: <RocketOutlined style={{ fontSize: "20px" }} />,
      LISTO_PARA_RECOGER: <ShopOutlined style={{ fontSize: "20px" }} />,
      EN_CAMINO: <TruckOutlined style={{ fontSize: "20px" }} />,
      ENTREGADO: <CheckCircleOutlined style={{ fontSize: "20px" }} />,
    };
    return iconos[estado] || <ClockCircleOutlined style={{ fontSize: "20px" }} />;
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    if (filtroTipo === "TODOS") return true;
    return pedido.tipoEntrega === filtroTipo;
  });

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
        <p className="mt-3 text-muted fs-5">Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center bg-white p-4 rounded-3 shadow-sm">
            <div>
              <h2 className="mb-1" style={{ color: "#2c3e50", fontWeight: "600" }}>Gestión de Pedidos</h2>
              <p className="text-muted mb-0">Control de estados y seguimiento de entregas</p>
            </div>
            <Badge bg="primary" className="fs-4 px-4 py-3" style={{ backgroundColor: "#3498db" }}>
              {pedidosFiltrados.length}
            </Badge>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <div className="bg-white p-3 rounded-3 shadow-sm">
            <h6 className="text-uppercase fw-bold mb-3" style={{ color: "#7f8c8d", fontSize: "0.85rem", letterSpacing: "1px" }}>
              Filtrar por Estado
            </h6>
            <ButtonGroup className="w-100">
              <Button
                variant={filtroEstado === "TODOS" ? "primary" : "outline-primary"}
                onClick={() => setFiltroEstado("TODOS")}
                className="py-2"
                style={filtroEstado === "TODOS" ? { backgroundColor: "#3498db", borderColor: "#3498db" } : {}}
              >
                Todos
              </Button>
              <Button
                variant={filtroEstado === "POR_CONFIRMAR" ? "primary" : "outline-primary"}
                onClick={() => setFiltroEstado("POR_CONFIRMAR")}
                className="py-2"
                style={filtroEstado === "POR_CONFIRMAR" ? { backgroundColor: "#e67e22", borderColor: "#e67e22" } : {}}
              >
                Por Confirmar
              </Button>
              <Button
                variant={filtroEstado === "EN_PREPARACION" ? "primary" : "outline-primary"}
                onClick={() => setFiltroEstado("EN_PREPARACION")}
                className="py-2"
                style={filtroEstado === "EN_PREPARACION" ? { backgroundColor: "#9b59b6", borderColor: "#9b59b6" } : {}}
              >
                En Preparación
              </Button>
            </ButtonGroup>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="bg-white p-3 rounded-3 shadow-sm">
            <h6 className="text-uppercase fw-bold mb-3" style={{ color: "#7f8c8d", fontSize: "0.85rem", letterSpacing: "1px" }}>
              Filtrar por Tipo de Entrega
            </h6>
            <ButtonGroup className="w-100">
              <Button
                variant={filtroTipo === "TODOS" ? "primary" : "outline-primary"}
                onClick={() => setFiltroTipo("TODOS")}
                className="py-2"
                style={filtroTipo === "TODOS" ? { backgroundColor: "#3498db", borderColor: "#3498db" } : {}}
              >
                Todos ({pedidos.length})
              </Button>
              <Button
                variant={filtroTipo === "DELIVERY" ? "primary" : "outline-primary"}
                onClick={() => setFiltroTipo("DELIVERY")}
                className="py-2"
                style={filtroTipo === "DELIVERY" ? { backgroundColor: "#3498db", borderColor: "#3498db" } : {}}
              >
                Delivery ({pedidos.filter(p => p.tipoEntrega === "DELIVERY").length})
              </Button>
              <Button
                variant={filtroTipo === "RECOJO_TIENDA" ? "primary" : "outline-primary"}
                onClick={() => setFiltroTipo("RECOJO_TIENDA")}
                className="py-2"
                style={filtroTipo === "RECOJO_TIENDA" ? { backgroundColor: "#3498db", borderColor: "#3498db" } : {}}
              >
                Recojo ({pedidos.filter(p => p.tipoEntrega === "RECOJO_TIENDA").length})
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>

      {pedidosFiltrados.length === 0 ? (
        <div className="row">
          <div className="col-12">
            <div className="bg-white p-5 rounded-3 shadow-sm text-center">
              <div className="mb-3" style={{ fontSize: "4rem", color: "#95a5a6" }}></div>
              <h4 style={{ color: "#2c3e50" }}>No hay pedidos para mostrar</h4>
              <p className="text-muted">Intenta con otros filtros para ver más resultados</p>
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
                    <div className="d-flex gap-2 align-items-center">
                      <Badge 
                        bg="light" 
                        text="dark" 
                        className="px-3 py-2"
                        style={{ fontSize: "0.85rem", fontWeight: "500" }}
                      >
                        {pedido.tipoEntrega === "DELIVERY" ? "Delivery" : "Recojo"}
                      </Badge>
                      <Badge 
                        className="px-3 py-2"
                        style={{ 
                          fontSize: "0.85rem", 
                          fontWeight: "500",
                          backgroundColor: obtenerColorEstado(pedido.estado),
                          border: "none"
                        }}
                      >
                        {pedido.estado.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </div>
                </Card.Header>

                <Card.Body className="p-4">
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
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
                        <span className="ms-2" style={{ color: "#2c3e50", fontSize: "0.85rem" }}>{pedido.usuario.correo}</span>
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <h6 className="text-uppercase fw-bold mb-3" style={{ color: "#7f8c8d", fontSize: "0.85rem", letterSpacing: "1px" }}>
                        Detalles del Pedido
                      </h6>
                      <div className="mb-2">
                        <span className="text-muted" style={{ fontSize: "0.9rem" }}>Fecha:</span>
                        <span className="ms-2" style={{ color: "#2c3e50", fontSize: "0.9rem" }}>{formatearFecha(pedido.fechaPedido)}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-muted" style={{ fontSize: "0.9rem" }}>Estado Pago:</span>
                        <span className="ms-2" style={{ color: "#2c3e50" }}>{pedido.estadoPago.replace(/_/g, " ")}</span>
                      </div>
                      <div className="mt-3 p-3 rounded text-center" style={{ backgroundColor: "#ecf0f1" }}>
                        <span className="text-muted d-block mb-1" style={{ fontSize: "0.85rem" }}>Total</span>
                        <span className="fw-bold fs-3" style={{ color: "#27ae60" }}>S/ {pedido.total.toFixed(2)}</span>
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
                        <span className="ms-2" style={{ color: "#2c3e50" }}>{pedido.direccionEntrega || pedido.usuario.direccion}</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-muted" style={{ fontSize: "0.9rem" }}>Teléfono:</span>
                        <span className="ms-2" style={{ color: "#2c3e50" }}>{pedido.telefonoContacto || pedido.usuario.celular}</span>
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

                  {pedido.observaciones && pedido.tipoEntrega === "RECOJO_TIENDA" && (
                    <div className="mb-4 p-3 rounded" style={{ backgroundColor: "#fff3cd" }}>
                      <h6 className="text-uppercase fw-bold mb-2" style={{ color: "#856404", fontSize: "0.85rem", letterSpacing: "1px" }}>
                        Observaciones
                      </h6>
                      <p className="mb-0" style={{ color: "#856404" }}>{pedido.observaciones}</p>
                    </div>
                  )}

                  <div>
                    <h6 className="text-uppercase fw-bold mb-3" style={{ color: "#7f8c8d", fontSize: "0.85rem", letterSpacing: "1px" }}>
                      Productos ({pedido.detalles.length})
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
                      variant="outline-secondary"
                      className="flex-grow-1"
                      onClick={() => abrirModalHistorial(pedido)}
                      style={{ borderWidth: "2px" }}
                    >
                      Ver Historial
                    </Button>
                    {obtenerTextoBoton(pedido.estado, pedido.tipoEntrega) && (
                      <Button
                        className="flex-grow-1"
                        onClick={() => handleCambiarEstado(pedido)}
                        disabled={procesandoId === pedido.id}
                        style={{ 
                          backgroundColor: obtenerColorEstado(pedido.estado), 
                          borderColor: obtenerColorEstado(pedido.estado),
                          fontWeight: "600" 
                        }}
                      >
                        {procesandoId === pedido.id ? (
                          <>
                            <Spinner size="sm" animation="border" className="me-2" />
                            Procesando...
                          </>
                        ) : (
                          obtenerTextoBoton(pedido.estado, pedido.tipoEntrega)
                        )}
                      </Button>
                    )}
                  </div>
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>
      )}

      <Modal 
        show={showModalHistorial} 
        onHide={() => setShowModalHistorial(false)} 
        centered 
        size="lg"
      >
        <Modal.Header closeButton className="border-0" style={{ backgroundColor: "#34495e" }}>
          <Modal.Title className="text-white d-flex align-items-center gap-2">
            <ClockCircleOutlined style={{ fontSize: "24px" }} />
            Historial del Pedido #{pedidoSeleccionado?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4" style={{ backgroundColor: "#ffffff", minHeight: "400px" }}>
          {cargandoHistorial ? (
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "350px" }}>
              <Spinner animation="border" variant="primary" style={{ width: "2.5rem", height: "2.5rem" }} />
              <p className="mt-3 text-muted">Cargando historial...</p>
            </div>
          ) : historial.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3" style={{ fontSize: "3rem", color: "#95a5a6" }}></div>
              <h5 style={{ color: "#2c3e50" }}>No hay historial disponible</h5>
              <p className="text-muted">Este pedido aún no tiene cambios registrados</p>
            </div>
          ) : (
            <div>
              <div className="mb-4 p-3 rounded" style={{ backgroundColor: "#ecf0f1" }}>
                <div className="row">
                  <div className="col-6">
                    <small className="text-muted d-block mb-1">Estado Actual</small>
                    <Badge 
                      className="px-3 py-2"
                      style={{ 
                        fontSize: "0.9rem", 
                        fontWeight: "500",
                        backgroundColor: obtenerColorEstado(pedidoSeleccionado?.estado),
                        border: "none"
                      }}
                    >
                      {pedidoSeleccionado?.estado.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div className="col-6 text-end">
                    <small className="text-muted d-block mb-1">Total de Cambios</small>
                    <span className="fw-bold fs-4" style={{ color: "#2c3e50" }}>{historial.length}</span>
                  </div>
                </div>
              </div>

              <Timeline
                mode="left"
                items={historial.map((item) => ({
                  color: obtenerColorEstado(item.estadoNuevo),
                  dot: obtenerIconoHistorial(item.estadoNuevo),
                  children: (
                    <div className="pb-2">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span 
                          className="px-3 py-1 rounded"
                          style={{ 
                            backgroundColor: obtenerColorEstado(item.estadoNuevo),
                            color: "white",
                            fontWeight: "600",
                            fontSize: "0.9rem"
                          }}
                        >
                          {item.estadoNuevo.replace(/_/g, " ")}
                        </span>
                        {item.estadoAnterior && (
                          <>
                            <span style={{ color: "#95a5a6" }}>←</span>
                            <span 
                              className="px-2 py-1 rounded"
                              style={{ 
                                backgroundColor: "#ecf0f1",
                                color: "#7f8c8d",
                                fontSize: "0.85rem"
                              }}
                            >
                              {item.estadoAnterior.replace(/_/g, " ")}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="mb-2 p-2 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                        <div className="mb-1" style={{ color: "#2c3e50", fontSize: "0.95rem" }}>
                          <strong>Observación:</strong> {item.observacion}
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2 mb-1" style={{ fontSize: "0.9rem", color: "#7f8c8d" }}>
                        <UserOutlined style={{ fontSize: "14px" }} />
                        <span>
                          <strong>{item.usuarioCambio.nombre} {item.usuarioCambio.apellido}</strong>
                          <span className="ms-2 px-2 py-1 rounded" style={{ backgroundColor: "#e8f4f8", color: "#3498db", fontSize: "0.75rem" }}>
                            {item.usuarioCambio.role}
                          </span>
                        </span>
                      </div>

                      <div style={{ color: "#95a5a6", fontSize: "0.85rem" }}>
                        {formatearFecha(item.fechaCambio)}
                      </div>
                    </div>
                  )
                }))}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0" style={{ backgroundColor: "#f8f9fa" }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowModalHistorial(false)}
            style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}