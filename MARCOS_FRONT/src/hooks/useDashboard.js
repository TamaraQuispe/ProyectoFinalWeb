import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../services/api";
import { toast } from "react-toastify";

export const useDashboard = () => {
  const [estadisticasGenerales, setEstadisticasGenerales] = useState({
    totalUsuarios: 0,
    totalProductos: 0,
    totalPedidos: 0,
    totalVentas: 0.0,
  });

  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [ventasPorCategoria, setVentasPorCategoria] = useState([]);
  const [estadoPedidos, setEstadoPedidos] = useState([]);
  const [pedidosRecientes, setPedidosRecientes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const [stats, productos, categorias, estados, recientes] = await Promise.all([
        apiRequest("/admin/dashboard/estadisticas-generales", "GET", null, true, true),
        apiRequest("/admin/dashboard/productos-mas-vendidos", "GET", null, true, true),
        apiRequest("/admin/dashboard/ventas-por-categoria", "GET", null, true, true),
        apiRequest("/admin/dashboard/estado-pedidos", "GET", null, true, true),
        apiRequest("/admin/dashboard/pedidos-recientes?limit=4", "GET", null, true, true),
      ]);

      if (stats.success && stats.data) {
        setEstadisticasGenerales(stats.data);
      }

      if (productos.success && productos.data) {
        setProductosMasVendidos(productos.data);
      }

      if (categorias.success && categorias.data) {
        setVentasPorCategoria(categorias.data);
      }

      if (estados.success && estados.data) {
        setEstadoPedidos(estados.data);
      }

      if (recientes.success && recientes.data) {
        setPedidosRecientes(recientes.data);
      }

    } catch (error) {
      toast.error(error.message || "Error al cargar el dashboard");
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDashboard();
  }, [cargarDashboard]);

  const refrescarDashboard = async () => {
    try {
      setRefreshing(true);
      await cargarDashboard();
      toast.success("Dashboard actualizado");
    } catch (error) {
      toast.error("Error al refrescar");
    } finally {
      setRefreshing(false);
    }
  };

  return {
    estadisticasGenerales,
    productosMasVendidos,
    ventasPorCategoria,
    estadoPedidos,
    pedidosRecientes,
    loading,
    refreshing,
    refrescarDashboard,
  };
};