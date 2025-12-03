import { useState } from 'react';
import { toast } from 'react-toastify';
import { apiRequest } from '../services/api';

export const useCategories = () => {
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/categorias', 'GET');
      setCategorias(response.data || []);
      return response.data || [];
    } catch (error) {
      toast.error(error.message || 'Error al cargar categorías');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const crearCategoria = async (categoriaData) => {
    setLoading(true);
    try {
      const data = await apiRequest('/admin/categorias', 'POST', categoriaData, true, true);
      toast.success('Categoría creada exitosamente');
      return data;
    } catch (error) {
      toast.error(error.message || 'Error al crear categoría');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const actualizarCategoria = async (id, categoriaData) => {
    setLoading(true);
    try {
      const data = await apiRequest(`/admin/categorias/${id}`, 'PUT', categoriaData, true, true);
      toast.success('Categoría actualizada exitosamente');
      return data;
    } catch (error) {
      toast.error(error.message || 'Error al actualizar categoría');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const eliminarCategoria = async (id) => {
    setLoading(true);
    try {
      await apiRequest(`/admin/categorias/${id}`, 'DELETE', null, true, true);
      toast.success('Categoría eliminada exitosamente');
      setCategorias(prev => prev.filter(cat => cat.id !== id));
    } catch (error) {
      toast.error(error.message || 'Error al eliminar categoría');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    categorias,
    fetchCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
  };
};