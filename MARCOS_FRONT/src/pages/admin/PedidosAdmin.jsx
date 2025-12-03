import React, { useEffect, useState } from "react";
import { usePedidosAdmin } from "../../hooks/usePedidosAdmin";
import { useBoletas } from "../../hooks/useBoletas";
import { API_URL } from "../../services/api";

export default function PedidosAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [selectedEstado, setSelectedEstado] = useState("TODOS");
  const [selectedTipoEntrega, setSelectedTipoEntrega] = useState("TODOS");
  const [showModal, setShowModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      const { data } = await usePedidosAdmin.listarTodos();
      const sorted = data.sort((a, b) => b.id - a.id);
      setPedidos(sorted);
      setFilteredPedidos(sorted);
    } catch {}
  };

  useEffect(() => {
    applyFilters();
  }, [selectedEstado, selectedTipoEntrega, pedidos]);

  const applyFilters = async () => {
    let filtered = [...pedidos];

    if (selectedEstado !== "TODOS") {
      try {
        const { data } = await usePedidosAdmin.listarPorEstado(selectedEstado);
        filtered = data.sort((a, b) => b.id - a.id);
      } catch {}
    }

    if (selectedTipoEntrega !== "TODOS") {
      filtered = filtered.filter(p => p.tipoEntrega === selectedTipoEntrega);
    }

    setFilteredPedidos(filtered);
  };

  const getEstadoColor = (estado) => {
    const colors = {
      POR_CONFIRMAR: { bg: "#fff3cd", text: "#856404", border: "#ffc107" },
      CONFIRMADO: { bg: "#d1ecf1", text: "#0c5460", border: "#17a2b8" },
      EN_PREPARACION: { bg: "#d4edda", text: "#155724", border: "#28a745" },
      ENTREGADO: { bg: "#d4edda", text: "#155724", border: "#28a745" },
      CANCELADO: { bg: "#f8d7da", text: "#721c24", border: "#dc3545" },
    };
    return colors[estado] || { bg: "#e9ecef", text: "#495057", border: "#6c757d" };
  };

  const openModal = (pedido) => {
    setSelectedPedido(pedido);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPedido(null);
  };

  const handleDescargarBoleta = async (pedidoId) => {
    try {
      const blob = await useBoletas.descargarBoletaAdmin(pedidoId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `boleta_pedido_${pedidoId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {}
  };

  return (
    <div
      style={{
        background: "#f9fafc",
        minHeight: "100vh",
        padding: "32px",
        fontFamily: "'Segoe UI', 'Roboto', Arial, sans-serif",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontWeight: 700, color: "#444" }}>
          Pedidos
        </h1>
        <p style={{ color: "#888", margin: "6px 0 0 0" }}>
          Visualización completa de pedidos con timeline y boletas
        </p>
      </div>
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
        <div>
          <label style={{ marginRight: "8px", fontWeight: 600, color: "#444", fontSize: "14px" }}>
            Estado:
          </label>
          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            <option value="TODOS">Todos los estados</option>
            <option value="POR_CONFIRMAR">Por Confirmar</option>
            <option value="CONFIRMADO">Confirmado</option>
            <option value="EN_PREPARACION">En Preparación</option>
            <option value="ENTREGADO">Entregado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
        <div>
          <label style={{ marginRight: "8px", fontWeight: 600, color: "#444", fontSize: "14px" }}>
            Tipo Entrega:
          </label>
          <select
            value={selectedTipoEntrega}
            onChange={(e) => setSelectedTipoEntrega(e.target.value)}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
            }}
          >
            <option value="TODOS">Todos los tipos</option>
            <option value="DELIVERY">Delivery</option>
            <option value="RECOJO_TIENDA">Recojo en Tienda</option>
          </select>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredPedidos.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "48px",
              color: "#bdbdbd",
              background: "#fff",
              borderRadius: "10px",
              border: "1px solid #e0e0e0",
            }}
          >
            No hay pedidos para mostrar
          </div>
        ) : (
          filteredPedidos.map((pedido) => {
            const estadoStyle = getEstadoColor(pedido.estado);
            return (
              <div
                key={pedido.id}
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0px 6px 16px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0px 2px 8px rgba(0,0,0,0.08)";
                }}
              >
                <div style={{ padding: "20px", flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                      paddingBottom: "12px",
                      borderBottom: "2px solid #f0f0f0",
                    }}
                  >
                    <h3 style={{ margin: 0, color: "#333", fontSize: "18px" }}>
                      Pedido #{pedido.id}
                    </h3>
                    <span
                      style={{
                        background: estadoStyle.bg,
                        color: estadoStyle.text,
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 700,
                        border: `1px solid ${estadoStyle.border}`,
                      }}
                    >
                      {pedido.estado.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#666", fontSize: "14px" }}>Cliente:</span>
                      <span style={{ fontWeight: 600, color: "#333", fontSize: "14px" }}>
                        {pedido.usuario?.nombre} {pedido.usuario?.apellido}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#666", fontSize: "14px" }}>Celular:</span>
                      <span style={{ color: "#333", fontSize: "14px" }}>
                        {pedido.usuario?.celular || "No especificado"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#666", fontSize: "14px" }}>Entrega:</span>
                      <span style={{ fontWeight: 600, color: "#333", fontSize: "14px" }}>
                        {pedido.tipoEntrega === "DELIVERY" ? "Delivery" : "Recojo en Tienda"}
                      </span>
                    </div>
                    {pedido.direccionEntrega && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span style={{ color: "#666", fontSize: "14px" }}>Dirección:</span>
                        <span
                          style={{
                            color: "#333",
                            fontSize: "14px",
                            textAlign: "right",
                            maxWidth: "60%",
                          }}
                        >
                          {pedido.direccionEntrega}
                        </span>
                      </div>
                    )}
                    {pedido.referencia && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span style={{ color: "#666", fontSize: "14px" }}>Referencia:</span>
                        <span
                          style={{
                            color: "#333",
                            fontSize: "14px",
                            textAlign: "right",
                            maxWidth: "60%",
                          }}
                        >
                          {pedido.referencia}
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#666", fontSize: "14px" }}>Estado Pago:</span>
                      <span
                        style={{
                          fontWeight: 600,
                          color: pedido.estadoPago === "VERIFICADO" ? "#28a745" : "#ffc107",
                          fontSize: "14px",
                        }}
                      >
                        {pedido.estadoPago}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ color: "#666", fontSize: "14px" }}>Fecha:</span>
                      <span style={{ color: "#333", fontSize: "14px" }}>
                        {new Date(pedido.fechaPedido).toLocaleDateString("es-PE", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#f8f9fa",
                      padding: "12px",
                      borderRadius: "6px",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>
                      Productos: {pedido.detalles?.length || 0} item(s)
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "#377dff" }}>
                      Total: S/ {pedido.total?.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div style={{ padding: "0 20px 20px 20px", display: "flex", gap: "8px" }}>
                  <button
                    style={{
                      flex: 1,
                      background: "#377dff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "10px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                    onClick={() => openModal(pedido)}
                  >
                    Ver Detalles
                  </button>
                  {pedido.estado === "ENTREGADO" && (
                    <button
                      style={{
                        flex: 1,
                        background: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "10px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                      onClick={() => handleDescargarBoleta(pedido.id)}
                    >
                      Descargar Boleta
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      {showModal && selectedPedido && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              maxWidth: "900px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0px 10px 40px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "24px",
                borderBottom: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                background: "#fff",
                zIndex: 1,
              }}
            >
              <h2 style={{ margin: 0, fontSize: "22px", color: "#333" }}>
                Detalles del Pedido #{selectedPedido.id}
              </h2>
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "28px",
                  cursor: "pointer",
                  color: "#666",
                  lineHeight: 1,
                }}
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <div style={{ padding: "24px" }}>
              <div
                style={{
                  background: "#f8f9fa",
                  padding: "20px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#444", textAlign: "center" }}>
                  Información del Cliente
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "600px", margin: "0 auto" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#666", fontSize: "13px", marginBottom: "4px" }}>Nombre</div>
                    <div style={{ fontWeight: 600, color: "#333" }}>
                      {selectedPedido.usuario.nombre} {selectedPedido.usuario.apellido}
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#666", fontSize: "13px", marginBottom: "4px" }}>DNI</div>
                    <div style={{ fontWeight: 600, color: "#333" }}>
                      {selectedPedido.usuario.dni}
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#666", fontSize: "13px", marginBottom: "4px" }}>Correo</div>
                    <div style={{ fontWeight: 600, color: "#333" }}>
                      {selectedPedido.usuario.correo}
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#666", fontSize: "13px", marginBottom: "4px" }}>Celular</div>
                    <div style={{ fontWeight: 600, color: "#333" }}>
                      {selectedPedido.usuario.celular}
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "#f8f9fa",
                  padding: "20px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#444", textAlign: "center" }}>
                  Información de Entrega
                </h3>
                <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "12px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: "#666", fontSize: "13px", marginBottom: "4px" }}>Tipo</div>
                      <div style={{ fontWeight: 600, color: "#333" }}>
                        {selectedPedido.tipoEntrega === "DELIVERY" ? "Delivery" : "Recojo en Tienda"}
                      </div>
                    </div>
                    {selectedPedido.telefonoContacto && (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ color: "#666", fontSize: "13px", marginBottom: "4px" }}>Teléfono Contacto</div>
                        <div style={{ fontWeight: 600, color: "#333" }}>
                          {selectedPedido.telefonoContacto}
                        </div>
                      </div>
                    )}
                  </div>
                  {selectedPedido.direccionEntrega && (
                    <div style={{ textAlign: "center", marginBottom: "12px" }}>
                      <div style={{ color: "#666", fontSize: "13px", marginBottom: "4px" }}>Dirección</div>
                      <div style={{ fontWeight: 600, color: "#333" }}>
                        {selectedPedido.direccionEntrega}
                      </div>
                    </div>
                  )}
                  {selectedPedido.referencia && (
                    <div style={{ textAlign: "center", marginBottom: "12px" }}>
                      <div style={{ color: "#666", fontSize: "13px", marginBottom: "4px" }}>Referencia</div>
                      <div style={{ fontWeight: 600, color: "#333" }}>
                        {selectedPedido.referencia}
                      </div>
                    </div>
                  )}
                  {selectedPedido.observaciones && (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ color: "#666", fontSize: "13px", marginBottom: "4px" }}>Observaciones</div>
                      <div style={{ fontWeight: 600, color: "#333" }}>
                        {selectedPedido.observaciones}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "#444", textAlign: "center" }}>
                  Productos del Pedido
                </h3>
                <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                  {selectedPedido.detalles.map((detalle) => (
                    <div
                      key={detalle.id}
                      style={{
                        display: "flex",
                        gap: "16px",
                        padding: "16px",
                        background: "#f8f9fa",
                        borderRadius: "8px",
                        marginBottom: "12px",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={API_URL + detalle.producto.imagen}
                        alt={detalle.producto.nombre}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid #d1d5db",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: "#333", marginBottom: "6px", fontSize: "15px" }}>
                          {detalle.producto.nombre}
                        </div>
                        <div style={{ fontSize: "13px", color: "#666", marginBottom: "6px" }}>
                          {detalle.producto.descripcion}
                        </div>
                        <div style={{ fontSize: "14px", color: "#666" }}>
                          Cantidad: <span style={{ fontWeight: 600 }}>{detalle.cantidad}</span> x S/ {detalle.precioUnitario.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "17px", fontWeight: 700, color: "#377dff" }}>
                          S/ {detalle.subtotal.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div
                    style={{
                      borderTop: "2px solid #d1d5db",
                      paddingTop: "16px",
                      marginTop: "16px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "24px", fontWeight: 700, color: "#333" }}>
                      Total: <span style={{ color: "#377dff" }}>S/ {selectedPedido.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}