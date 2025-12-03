import { apiRequest } from "../services/api";
import { toast } from "react-toastify";

export const useBoletas = {
  verificarDisponibilidad: async (pedidoId) => {
    try {
      const response = await apiRequest(`/boletas/pedido/${pedidoId}/disponibilidad`, "GET", null, true);
      return response;
    } catch (error) {}
  },

  verBoleta: async (pedidoId) => {
    try {
      const blob = await apiRequest(`/boletas/pedido/${pedidoId}/ver`, "GET", null, true, false, false, true);
      return blob;
    } catch (error) {
      toast.error("Error al cargar la boleta");
      throw error;
    }
  },

  descargarBoleta: async (pedidoId) => {
    try {
      const blob = await apiRequest(`/boletas/pedido/${pedidoId}/descargar`, "GET", null, true, false, false, true);
      toast.success("Boleta descargada exitosamente");
      return blob;
    } catch (error) {
      toast.error("Error al descargar la boleta");
      throw error;
    }
  },

  verBoletaAdmin: async (pedidoId) => {
    try {
      const blob = await apiRequest(`/boletas/admin/pedido/${pedidoId}/ver`, "GET", null, true, true, false, true);
      return blob;
    } catch (error) {
      toast.error("Error al cargar la boleta");
      throw error;
    }
  },

  descargarBoletaAdmin: async (pedidoId) => {
    try {
      const blob = await apiRequest(`/boletas/admin/pedido/${pedidoId}/descargar`, "GET", null, true, true, false, true);
      toast.success("Boleta descargada");
      return blob;
    } catch (error) {
      toast.error("Error al descargar la boleta");
      throw error;
    }
  },
};