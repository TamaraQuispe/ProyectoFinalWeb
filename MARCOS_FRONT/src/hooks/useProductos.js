import { useState } from 'react';
import { toast } from 'react-toastify';
import { apiRequest, API_URL } from '../services/api';

export const useProductos = () => {
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);

  const completarImagenes = (productos) => {
    return productos.map(producto => ({
      ...producto,
      imagen: API_URL + producto.imagen
    }));
  };

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/productos', 'GET');
      const data = completarImagenes(res.data || []);
      setProductos(data);
      return data;
    } catch (error) {
      toast.error(error.message || 'Error al cargar productos');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const crearProducto = async (formData) => {
    setLoading(true);
    try {
      const data = await apiRequest('/admin/productos', 'POST', formData, true, true);
      toast.success('Producto creado exitosamente');
      return data;
    } catch (error) {
      toast.error(error.message || 'Error al crear producto');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const actualizarProducto = async (id, formData) => {
    setLoading(true);
    try {
      const data = await apiRequest(`/admin/productos/${id}`, 'PUT', formData, true, true);
      toast.success('Producto actualizado exitosamente');
      return data;
    } catch (error) {
      toast.error(error.message || 'Error al actualizar producto');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id) => {
    setLoading(true);
    try {
      await apiRequest(`/admin/productos/${id}`, 'DELETE', null, true, true);
      toast.success('Producto eliminado exitosamente');
      setProductos(prev => prev.filter(prod => prod.id !== id));
    } catch (error) {
      toast.error(error.message || 'Error al eliminar producto');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    productos,
    fetchProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
  };
};