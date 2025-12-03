import { apiRequest } from "../services/api";
import { toast } from "react-toastify";

export const usePedidosVendedor = {
  listarTodos: async () => {
    try {
      const { data } = await apiRequest("/vendedor/pedidos", "GET", null, true, true);
      return { data };
    } catch (error) {
      toast.error("Error al cargar los pedidos");
      throw error;
    }
  },

  listarPorEstado: async (estado) => {
    try {
      const { data } = await apiRequest(`/vendedor/pedidos/estado/${estado}`, "GET", null, true, true);
      return { data };
    } catch (error) {
      toast.error(`Error al cargar pedidos con estado ${estado}`);
      throw error;
    }
  },

  ver: async (id) => {
    try {
      const { data } = await apiRequest(`/vendedor/pedidos/${id}`, "GET", null, true, true);
      return { data };
    } catch (error) {
      toast.error("Error al cargar el pedido");
      throw error;
    }
  },

  verificarPago: async (id) => {
    try {
      const { data } = await apiRequest(`/vendedor/pedidos/${id}/verificar-pago`, "PUT", null, true, true);
      toast.success("Pago verificado exitosamente");
      return { data };
    } catch (error) {
      toast.error(error.message || "Error al verificar el pago");
      throw error;
    }
  },

  rechazarPago: async (id, motivo) => {
    try {
      const { data } = await apiRequest(`/vendedor/pedidos/${id}/rechazar-pago`, "PUT", { motivo }, true, true);
      toast.warning("Pago rechazado. Se notificó al cliente");
      return { data };
    } catch (error) {
      toast.error(error.message || "Error al rechazar el pago");
      throw error;
    }
  },

  cambiarEstado: async (id, nuevoEstado, observacion) => {
    try {
      const { data } = await apiRequest(
        `/vendedor/pedidos/${id}/estado`,
        "PUT",
        { nuevoEstado, observacion },
        true,
        true
      );
      toast.success(`Estado cambiado a: ${nuevoEstado.replace(/_/g, " ")}`);
      return { data };
    } catch (error) {
      toast.error(error.message || "Error al cambiar el estado");
      throw error;
    }
  },

  verHistorial: async (id) => {
    try {
      const { data } = await apiRequest(`/vendedor/pedidos/${id}/historial`, "GET", null, true, true);
      return { data };
    } catch (error) {
      toast.error("Error al cargar el historial");
      throw error;
    }
  },
};