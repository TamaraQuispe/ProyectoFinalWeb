import React from "react";
import { FaBox, FaClock, FaCheckCircle, FaTruck, FaUtensils, FaTimesCircle, FaDownload, FaFileImage, FaMoneyBillWave } from "react-icons/fa";

const OrderCard = ({ pedido, onDescargarBoleta, boletaDisponible }) => {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
    return {
      date: date.toLocaleDateString('es-PE', optionsDate),
      time: date.toLocaleTimeString('es-PE', optionsTime)
    };
  };

  const estadosProgresion = {
    DELIVERY: [
      { key: "POR_CONFIRMAR", label: "Por Confirmar" },
      { key: "CONFIRMADO", label: "Confirmado" },
      { key: "EN_PREPARACION", label: "En Preparación" },
      { key: "EN_CAMINO", label: "En Camino" },
      { key: "ENTREGADO", label: "Entregado" }
    ],
    RECOJO_TIENDA: [
      { key: "POR_CONFIRMAR", label: "Por Confirmar" },
      { key: "CONFIRMADO", label: "Confirmado" },
      { key: "EN_PREPARACION", label: "En Preparación" },
      { key: "LISTO_PARA_RECOGER", label: "Listo para Recoger" },
      { key: "ENTREGADO", label: "Entregado" }
    ]
  };

  const getEstadoIcon = (estado) => {
    const icons = {
      POR_CONFIRMAR: <FaClock size={16} />,
      CONFIRMADO: <FaCheckCircle size={16} />,
      EN_PREPARACION: <FaUtensils size={16} />,
      LISTO_PARA_RECOGER: <FaBox size={16} />,
      EN_CAMINO: <FaTruck size={16} />,
      ENTREGADO: <FaCheckCircle size={16} />,
      CANCELADO: <FaTimesCircle size={16} />
    };
    return icons[estado] || icons.POR_CONFIRMAR;
  };

  const estados = estadosProgresion[pedido.tipoEntrega] || estadosProgresion.DELIVERY;
  const esCancelado = pedido.estado === "CANCELADO";
  const { date, time } = formatDateTime(pedido.fechaPedido);

  return (
    <div style={styles.orderCard}>
      <div style={styles.orderHeader}>
        <div>
          <h3 style={styles.orderId}>Pedido #{pedido.id}</h3>
          <p style={styles.orderDate}>
            {date} - {time}
          </p>
        </div>
        <button 
          onClick={() => onDescargarBoleta(pedido)}
          disabled={!boletaDisponible}
          style={{
            ...styles.downloadBtn,
            opacity: boletaDisponible ? 1 : 0.5,
            cursor: boletaDisponible ? "pointer" : "not-allowed",
            backgroundColor: boletaDisponible ? "#2196f3" : "#9e9e9e"
          }}
        >
          <FaDownload style={{ marginRight: "6px" }} />
          {boletaDisponible ? "Descargar Boleta" : "Boleta No Disponible"}
        </button>
      </div>

      <div style={styles.orderBody}>
        <div style={styles.orderDetailsGrid}>
          <div style={styles.orderInfo}>
            <h4 style={styles.sectionSubtitle}>Productos</h4>
            <div style={styles.orderItems}>
              {pedido.detalles.map((detalle, index) => (
                <div key={index} style={styles.orderItem}>
                  <span style={styles.itemName}>
                    {detalle.producto.nombre} x{detalle.cantidad}
                  </span>
                  <span style={styles.itemPrice}>
                    S/ {detalle.subtotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.orderInfo}>
            <h4 style={styles.sectionSubtitle}>Detalles de Entrega</h4>
            <div style={styles.deliveryDetails}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Tipo:</span>
                <span style={styles.detailValue}>
                  {pedido.tipoEntrega === "DELIVERY" ? (
                    <>
                      <FaTruck style={{ marginRight: "6px" }} />
                      Delivery
                    </>
                  ) : (
                    <>
                      <FaBox style={{ marginRight: "6px" }} />
                      Recojo en Tienda
                    </>
                  )}
                </span>
              </div>
              {pedido.tipoEntrega === "DELIVERY" && (
                <>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Dirección:</span>
                    <span style={styles.detailValue}>{pedido.direccionEntrega}</span>
                  </div>
                  <div style={styles.detailRow}>
                    <span style={styles.detailLabel}>Teléfono:</span>
                    <span style={styles.detailValue}>{pedido.telefonoContacto}</span>
                  </div>
                  {pedido.referencia && (
                    <div style={styles.detailRow}>
                      <span style={styles.detailLabel}>Referencia:</span>
                      <span style={styles.detailValue}>{pedido.referencia}</span>
                    </div>
                  )}
                </>
              )}
              {pedido.observaciones && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Observaciones:</span>
                  <span style={styles.detailValue}>{pedido.observaciones}</span>
                </div>
              )}
            </div>
          </div>

          <div style={styles.orderInfo}>
            <h4 style={styles.sectionSubtitle}>Información de Pago</h4>
            <div style={styles.paymentDetails}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>
                  <FaMoneyBillWave style={{ marginRight: "6px" }} />
                  Método:
                </span>
                <span style={styles.detailValue}>YAPE</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Número Yape:</span>
                <span style={styles.detailValue}>{pedido.numeroYape}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Estado Pago:</span>
                <span style={{
                  ...styles.paymentBadge,
                  backgroundColor: pedido.estadoPago === "VERIFICADO" ? "#e8f5e9" : "#fff3e0",
                  color: pedido.estadoPago === "VERIFICADO" ? "#4caf50" : "#ff9800"
                }}>
                  {pedido.estadoPago}
                </span>
              </div>
              {pedido.comprobanteYape && (
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>
                    <FaFileImage style={{ marginRight: "6px" }} />
                    Comprobante:
                  </span>
                  <span style={styles.detailValue}>Subido</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={styles.timelineContainer}>
          <h4 style={styles.timelineTitle}>Seguimiento del Pedido</h4>

          {esCancelado ? (
            <div style={styles.canceledStatus}>
              <FaTimesCircle size={24} color="#f44336" />
              <span style={styles.canceledText}>Pedido Cancelado</span>
            </div>
          ) : (
            <div style={styles.timeline}>
              {pedido.historial && pedido.historial.length > 0 ? (
                pedido.historial.slice().reverse().map((cambio, index) => {
                  const { date: cambioDate, time: cambioTime } = formatDateTime(cambio.fechaCambio);
                  const isLast = index === pedido.historial.length - 1;
                  
                  return (
                    <div key={cambio.id} style={styles.timelineItem}>
                      <div style={styles.timelinePoint}>
                        <div style={{
                          ...styles.timelineDot,
                          backgroundColor: "#4caf50",
                          border: isLast ? "3px solid #4caf50" : "none",
                          transform: isLast ? "scale(1.3)" : "scale(1)",
                        }}>
                          <div style={styles.timelineIcon}>
                            {getEstadoIcon(cambio.estadoNuevo)}
                          </div>
                        </div>
                        {index < pedido.historial.length - 1 && (
                          <div style={{
                            ...styles.timelineLine,
                            backgroundColor: "#4caf50"
                          }} />
                        )}
                      </div>
                      <div style={styles.timelineContent}>
                        <div style={styles.timelineHeader}>
                          <span style={styles.timelineLabel}>
                            {estados.find(e => e.key === cambio.estadoNuevo)?.label || cambio.estadoNuevo}
                          </span>
                          <span style={styles.timelineDate}>{cambioDate} {cambioTime}</span>
                        </div>
                        {cambio.observacion && (
                          <p style={styles.timelineObservation}>{cambio.observacion}</p>
                        )}
                        <p style={styles.timelineUser}>
                          Por: {cambio.usuarioCambio.nombre} {cambio.usuarioCambio.apellido}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={styles.timelineItem}>
                  <div style={styles.timelinePoint}>
                    <div style={{
                      ...styles.timelineDot,
                      backgroundColor: "#4caf50"
                    }}>
                      <div style={styles.timelineIcon}>
                        {getEstadoIcon(pedido.estado)}
                      </div>
                    </div>
                  </div>
                  <div style={styles.timelineContent}>
                    <span style={styles.timelineLabel}>
                      {estados.find(e => e.key === pedido.estado)?.label || pedido.estado}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={styles.orderFooter}>
          <div style={styles.orderTotal}>
            <span style={styles.totalLabel}>Total:</span>
            <span style={styles.totalAmount}>
              S/ {pedido.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  orderCard: {
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    padding: "25px",
    backgroundColor: "#fafafa",
    transition: "all 0.3s ease",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "2px solid #e0e0e0",
  },
  orderId: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    margin: "0 0 5px 0",
  },
  orderDate: {
    fontSize: "13px",
    color: "#888",
    margin: 0,
  },
  downloadBtn: {
    display: "flex",
    alignItems: "center",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  orderBody: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  orderDetailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e0e0e0",
  },
  orderInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  sectionSubtitle: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#555",
    margin: 0,
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  orderItems: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  orderItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    fontSize: "13px",
  },
  itemName: {
    color: "#555",
    fontWeight: "500",
  },
  itemPrice: {
    color: "#333",
    fontWeight: "600",
  },
  deliveryDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  paymentDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  detailRow: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  detailLabel: {
    fontSize: "12px",
    color: "#888",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
  },
  detailValue: {
    fontSize: "13px",
    color: "#333",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
  },
  paymentBadge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    width: "fit-content",
  },
  timelineContainer: {
    padding: "25px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    border: "1px solid #e0e0e0",
  },
  timelineTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
    margin: 0,
  },
  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
    marginTop: "20px",
  },
  timelineItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
  },
  timelinePoint: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
  },
  timelineDot: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    position: "relative",
    zIndex: 2,
    flexShrink: 0,
  },
  timelineIcon: {
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    width: "3px",
    height: "50px",
    transition: "all 0.3s ease",
  },
  timelineContent: {
    paddingBottom: "25px",
    flex: 1,
  },
  timelineHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  },
  timelineLabel: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#333",
  },
  timelineDate: {
    fontSize: "12px",
    color: "#888",
    fontWeight: "500",
  },
  timelineObservation: {
    fontSize: "13px",
    color: "#555",
    margin: "6px 0",
  },
  timelineUser: {
    fontSize: "12px",
    color: "#999",
    margin: "4px 0 0 0",
    fontStyle: "italic",
  },
  canceledStatus: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    gap: "10px",
  },
  canceledText: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#f44336",
  },
  orderFooter: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: "20px",
    borderTop: "2px solid #e0e0e0",
  },
  orderTotal: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  totalLabel: {
    fontSize: "16px",
    color: "#888",
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#d28f56",
  },
};

export default OrderCard;