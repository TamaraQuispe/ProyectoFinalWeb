import { apiRequest } from "../services/api";
import { toast } from "react-toastify";

export const usePedidosAdmin = {
  listarTodos: async () => {
    try {
      const { data } = await apiRequest("/admin/pedidos", "GET", null, true, true);
      return { data };
    } catch (error) {
      toast.error("Error al cargar los pedidos");
      throw error;
    }
  },

  listarPorEstado: async (estado) => {
    try {
      const { data } = await apiRequest(`/admin/pedidos/estado/${estado}`, "GET", null, true, true);
      return { data };
    } catch (error) {
      toast.error(`Error al cargar pedidos ${estado}`);
      throw error;
    }
  },

  ver: async (id) => {
    try {
      const { data } = await apiRequest(`/admin/pedidos/${id}`, "GET", null, true, true);
      return { data };
    } catch (error) {
      toast.error("Error al cargar el pedido");
      throw error;
    }
  },

  verHistorial: async (id) => {
    try {
      const { data } = await apiRequest(`/admin/pedidos/${id}/historial`, "GET", null, true, true);
      return { data };
    } catch (error) {
      toast.error("Error al cargar el historial");
      throw error;
    }
  },

  verificarPago: async (id) => {
    try {
      const { data } = await apiRequest(`/admin/pedidos/${id}/verificar-pago`, "PUT", null, true, true);
      toast.success("Pago verificado correctamente");
      return { data };
    } catch (error) {
      toast.error(error.message || "Error al verificar pago");
      throw error;
    }
  },

  rechazarPago: async (id, motivo) => {
    try {
      const { data } = await apiRequest(`/admin/pedidos/${id}/rechazar-pago`, "PUT", { motivo }, true, true);
      toast.warning("Pago rechazado");
      return { data };
    } catch (error) {
      toast.error(error.message || "Error al rechazar pago");
      throw error;
    }
  },

  cambiarEstado: async (id, nuevoEstado, observacion) => {
    try {
      const { data } = await apiRequest(
        `/admin/pedidos/${id}/estado`,
        "PUT",
        { nuevoEstado, observacion },
        true,
        true
      );
      toast.success("Estado actualizado exitosamente");
      return { data };
    } catch (error) {
      toast.error(error.message || "Error al cambiar estado");
      throw error;
    }
  },
};