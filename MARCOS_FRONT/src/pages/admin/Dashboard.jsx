import React from "react";
import { useDashboard } from "../../hooks/useDashboard";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const {
    estadisticasGenerales,
    productosMasVendidos,
    ventasPorCategoria,
    estadoPedidos,
    pedidosRecientes,
    loading,
    refreshing,
    refrescarDashboard,
  } = useDashboard();

  const COLORS = ["#28a745", "#ffc107", "#dc3545"];

  const getEstadoColor = (estado) => {
    const colors = {
      POR_CONFIRMAR: { bg: "#fff3cd", text: "#856404" },
      CONFIRMADO: { bg: "#d1ecf1", text: "#0c5460" },
      EN_PREPARACION: { bg: "#d4edda", text: "#155724" },
      ENTREGADO: { bg: "#d4edda", text: "#155724" },
      LISTO_PARA_RECOGER: { bg: "#cce5ff", text: "#004085" },
      EN_CAMINO: { bg: "#d1ecf1", text: "#0c5460" },
      CANCELADO: { bg: "#f8d7da", text: "#721c24" },
    };
    return colors[estado] || { bg: "#e9ecef", text: "#495057" };
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f9fafc",
        }}
      >
        <div style={{ fontSize: "24px", color: "#666", fontWeight: 600 }}>
          Cargando dashboard...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f9fafc",
        minHeight: "100vh",
        padding: "32px",
        fontFamily: "'Segoe UI', 'Roboto', Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontWeight: 700, color: "#444", fontSize: "28px" }}>
            Dashboard
          </h1>
          <p style={{ color: "#888", margin: "6px 0 0 0", fontSize: "15px" }}>
            Estadísticas y métricas generales
          </p>
        </div>

        <button
          onClick={refrescarDashboard}
          disabled={refreshing}
          style={{
            padding: "10px 20px",
            background: refreshing ? "#ccc" : "#377dff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: refreshing ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          {refreshing ? "Actualizando..." : "Refrescar"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "10px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0",
          }}
        >
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "8px", fontWeight: 600 }}>
            Total Usuarios
          </div>
          <div style={{ fontSize: "32px", fontWeight: 700, color: "#377dff" }}>
            {estadisticasGenerales.totalUsuarios || 0}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "10px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0",
          }}
        >
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "8px", fontWeight: 600 }}>
            Total Productos
          </div>
          <div style={{ fontSize: "32px", fontWeight: 700, color: "#ff8c42" }}>
            {estadisticasGenerales.totalProductos || 0}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "10px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0",
          }}
        >
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "8px", fontWeight: 600 }}>
            Total Pedidos
          </div>
          <div style={{ fontSize: "32px", fontWeight: 700, color: "#28a745" }}>
            {estadisticasGenerales.totalPedidos || 0}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "10px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0",
          }}
        >
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "8px", fontWeight: 600 }}>
            Total Ventas
          </div>
          <div style={{ fontSize: "32px", fontWeight: 700, color: "#17a2b8" }}>
            S/ {(estadisticasGenerales.totalVentas || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0",
            padding: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", color: "#333", fontWeight: 700 }}>
            Productos Más Vendidos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={productosMasVendidos}
              margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="nombre" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Bar dataKey="cantidadVendida" fill="#377dff" name="Cantidad Vendida" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0",
            padding: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", color: "#333", fontWeight: 700 }}>
            Ventas por Categoría
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ventasPorCategoria}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidadVendida" fill="#ff8c42" name="Cantidad Vendida" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0",
            padding: "20px",
          }}
        >
          <h3 style={{ margin: "0 0 20px 0", fontSize: "18px", color: "#333", fontWeight: 700 }}>
            Estado de Pedidos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={estadoPedidos}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {estadoPedidos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid #e0e0e0",
              background: "#f8f9fa",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "18px", color: "#333", fontWeight: 700 }}>
              Pedidos Recientes
            </h3>
          </div>
          <div style={{ padding: "16px" }}>
            {pedidosRecientes.length > 0 ? (
              pedidosRecientes.map((pedido) => {
                const estadoStyle = getEstadoColor(pedido.estado);
                return (
                  <div
                    key={pedido.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px",
                      background: "#f8f9fa",
                      borderRadius: "6px",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "#333", marginBottom: "4px" }}>
                        Pedido #{pedido.id}
                      </div>
                      <div style={{ fontSize: "13px", color: "#666" }}>{pedido.cliente}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700, color: "#377dff", marginBottom: "4px" }}>
                        S/ {(pedido.total || 0).toFixed(2)}
                      </div>
                      <span
                        style={{
                          background: estadoStyle.bg,
                          color: estadoStyle.text,
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        {(pedido.estado || "").replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                No hay pedidos recientes
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}