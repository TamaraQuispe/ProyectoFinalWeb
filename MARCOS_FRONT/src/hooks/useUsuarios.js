import { apiRequest } from "../services/api";
import { toast } from "react-toastify";

export const useUsuarios = {
  listar: async () => {
    try {
      const { data } = await apiRequest("/admin/usuarios", "GET", null, true, true);
      return { data };
    } catch (error) {
      toast.error("Error al cargar los usuarios");
      throw error;
    }
  },

  ver: async (id) => {
    try {
      const { data } = await apiRequest(`/admin/usuarios/${id}`, "GET", null, true, true);
      return { data };
    } catch (error) {
      toast.error("Error al cargar el usuario");
      throw error;
    }
  },

  actualizar: async (id, userData) => {
    try {
      const { data } = await apiRequest(`/admin/usuarios/${id}`, "PUT", userData, true, true);
      toast.success("Usuario actualizado exitosamente");
      return { data };
    } catch (error) {
      toast.error(error.message || "Error al actualizar usuario");
      throw error;
    }
  },

  eliminar: async (id) => {
    try {
      const { data } = await apiRequest(`/admin/usuarios/${id}`, "DELETE", null, true, true);
      toast.success("Usuario eliminado exitosamente");
      return { data };
    } catch (error) {
      toast.error(error.message || "Error al eliminar usuario");
      throw error;
    }
  },
};