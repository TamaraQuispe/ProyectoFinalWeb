import { apiRequest } from "../services/api";
import { toast } from "react-toastify";

export const usePedidosCliente = {
  crear: async (formData) => {
    try {
      const { data } = await apiRequest("/cliente/pedidos", "POST", formData, true, false, true);
      toast.success("¡Pedido realizado exitosamente! Espera la confirmación");
      return data;
    } catch (error) {
      toast.error(error.message || "Error al realizar el pedido");
      throw error;
    }
  },

  listar: async () => {
    try {
      const response = await apiRequest("/cliente/pedidos", "GET", null, true);
      return response.data || [];
    } catch (error) {
      toast.error("Error al cargar tus pedidos");
      throw error;
    }
  },

  ver: async (id) => {
    try {
      const response = await apiRequest(`/cliente/pedidos/${id}`, "GET", null, true);
      return response.data;
    } catch (error) {
      toast.error("Error al cargar el detalle del pedido");
      throw error;
    }
  },

  verHistorial: async (id) => {
    try {
      const response = await apiRequest(`/cliente/pedidos/${id}/historial`, "GET", null, true);
      return response.data || [];
    } catch (error) {
      toast.error("Error al cargar el historial del pedido");
      throw error;
    }
  },

  cancelar: async (id) => {
    try {
      const response = await apiRequest(`/cliente/pedidos/${id}/cancelar`, "PUT", null, true);
      toast.success("Pedido cancelado exitosamente");
      return response.data;
    } catch (error) {
      toast.error(error.message || "No se pudo cancelar el pedido");
      throw error;
    }
  },
};