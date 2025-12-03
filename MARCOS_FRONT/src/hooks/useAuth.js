import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import { toast } from "react-toastify";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // CARGA INICIAL
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    const role = localStorage.getItem("role");

    if (token && role) {
      setIsAuthenticated(true);
      setUser({ role });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }

    setLoading(false);
  }, []);

  // LOGIN CLIENTE
  const loginCliente = async (correo, password) => {
    try {
      const response = await apiRequest("/auth/cliente/login", "POST", { correo, password });

      if (response.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);

        setUser({ role: response.data.role });
        setIsAuthenticated(true);

        toast.success(response.message || "¡Bienvenido! Inicio de sesión exitoso");
      }

      return { data: response.data };
    } catch (error) {
      toast.error(error.message || "Error al iniciar sesión");
      throw error;
    }
  };

  // LOGIN VENDEDOR
  const loginVendedor = async (correo, password) => {
    try {
      const response = await apiRequest("/auth/vendedor/login", "POST", { correo, password });

      if (response.success) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("role", response.data.role);

        setUser({ role: response.data.role });
        setIsAuthenticated(true);

        toast.success(response.message || "¡Bienvenido vendedor!");
      }

      return { data: response.data };
    } catch (error) {
      toast.error(error.message || "Credenciales incorrectas");
      throw error;
    }
  };

  // LOGIN ADMIN
  const loginAdmin = async (correo, password) => {
    try {
      const response = await apiRequest("/auth/admin/login", "POST", { correo, password });

      if (response.success) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("role", response.data.role);

        setUser({ role: response.data.role });
        setIsAuthenticated(true);

        toast.success(response.message || "¡Bienvenido administrador!");
      }

      return { data: response.data };
    } catch (error) {
      toast.error(error.message || "Acceso denegado");
      throw error;
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    localStorage.removeItem("carrito");

    setUser(null);
    setIsAuthenticated(false);

    toast.info("Sesión cerrada");
  };

  // OBTENER ROLE
  const getRole = () => localStorage.getItem("role");

  return {
    user,
    loading,
    isAuthenticated,
    loginCliente,
    loginVendedor,
    loginAdmin,
    logout,
    getRole,
  };
};

// ACCIONES EXTRA (REGISTROS Y PERFIL)
export const useAuthActions = {
  registerCliente: async (userData) => {
    try {
      const response = await apiRequest("/auth/cliente/register", "POST", userData);
      toast.success(response.message || "¡Registro exitoso! Ya puedes iniciar sesión");
      return { data: response.data };
    } catch (error) {
      toast.error(error.message || "Error al registrarse");
      throw error;
    }
  },

  registerAdmin: async (userData) => {
    try {
      const response = await apiRequest("/auth/admin/register", "POST", userData, true, true);
      toast.success(response.message || "Administrador creado exitosamente");
      return { data: response.data };
    } catch (error) {
      toast.error(error.message || "Error al crear administrador");
      throw error;
    }
  },

  registerVendedor: async (userData) => {
    try {
      const response = await apiRequest("/auth/vendedor/register", "POST", userData, true, true);
      toast.success(response.message || "Vendedor creado exitosamente");
      return { data: response.data };
    } catch (error) {
      toast.error(error.message || "Error al crear vendedor");
      throw error;
    }
  },

  getProfile: async (isAdmin = false) => {
    try {
      const response = await apiRequest("/auth/profile", "GET", null, true, isAdmin);
      return { data: response.data || response };
    } catch (error) {
      toast.error("Error al cargar el perfil");
      throw error;
    }
  },

  updateProfile: async (userData, isAdmin = false) => {
    try {
      const response = await apiRequest("/auth/profile", "PUT", userData, true, isAdmin);
      toast.success(response.message || "Perfil actualizado exitosamente");
      return { data: response.data || response };
    } catch (error) {
      toast.error(error.message || "Error al actualizar perfil");
      throw error;
    }
  },
};