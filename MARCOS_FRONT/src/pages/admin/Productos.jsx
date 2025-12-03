import React, { useEffect, useState } from "react";
import { useProductos } from "../../hooks/useProductos";
import { useCategories } from "../../hooks/useCategories";

export default function Productos() {
  const { productos, fetchProductos, crearProducto, actualizarProducto, eliminarProducto } = useProductos();
  const { categorias, fetchCategorias } = useCategories();
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentProducto, setCurrentProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoriaId: "",
    imagen: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        await fetchProductos();
        await fetchCategorias();
      } catch {}
    }
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...productos];
    
    if (selectedCategoria !== "all") {
      filtered = filtered.filter(p => p.categoria.id === parseInt(selectedCategoria));
    }
    
    filtered.sort((a, b) => b.id - a.id);
    setFilteredProductos(filtered);
  }, [productos, selectedCategoria]);

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      categoriaId: "",
      imagen: null
    });
    setImagePreview(null);
    setCurrentProducto(null);
    setShowModal(true);
  };

  const handleOpenUpdateModal = (producto) => {
    setModalMode("update");
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      categoriaId: producto.categoria.id,
      imagen: null
    });
    setImagePreview(producto.imagen);
    setCurrentProducto(producto);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      categoriaId: "",
      imagen: null
    });
    setImagePreview(null);
    setCurrentProducto(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imagen: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("nombre", formData.nombre);
      data.append("descripcion", formData.descripcion);
      data.append("precio", formData.precio);
      data.append("stock", formData.stock);
      data.append("categoriaId", formData.categoriaId);
      
      if (modalMode === "create") {
        if (!formData.imagen) {
          toast.error("La imagen es requerida");
          return;
        }
        data.append("imagen", formData.imagen);
        await crearProducto(data);
      } else {
        if (formData.imagen) {
          data.append("imagen", formData.imagen);
        }
        await actualizarProducto(currentProducto.id, data);
      }
      
      await fetchProductos();
      handleCloseModal();
    } catch {}
  };

  const handleOpenDeleteModal = (producto) => {
    setCurrentProducto(producto);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await eliminarProducto(currentProducto.id);
      setShowDeleteModal(false);
      setCurrentProducto(null);
    } catch {}
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCurrentProducto(null);
  };

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
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontWeight: 700, color: "#444" }}>
            Gestión de Productos
          </h1>
        </div>
        <div>
          <button
            onClick={handleOpenCreateModal}
            style={{
              background: "#377dff",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: "6px",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0px 1px 4px rgba(0,0,0,0.08)",
              fontSize: "15px",
            }}
          >
            Añadir Producto
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "12px", fontWeight: 600, color: "#444" }}>
          Filtrar por categoría:
        </label>
        <select
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value)}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            fontSize: "15px",
            cursor: "pointer",
            boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <option value="all">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          overflowX: "auto",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0px 4px 14px rgba(0,0,0,0.11)",
          border: "1px solid #d1d5db",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "16px",
            minWidth: "1000px",
          }}
        >
          <thead>
            <tr style={{ background: "#377dff0d", color: "#444" }}>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db", width: "5%" }}>ID</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db", width: "10%" }}>Imagen</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db", width: "15%" }}>Nombre</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db", width: "20%" }}>Descripción</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db", width: "8%" }}>Precio</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db", width: "8%" }}>Stock</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db", width: "12%" }}>Categoría</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db", width: "22%" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "24px", color: "#bdbdbd" }}>
                  No hay productos
                </td>
              </tr>
            ) : (
              filteredProductos.map((prod) => (
                <tr
                  key={prod.id}
                  style={{
                    background: "#f6fcff",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#e7f2fe"}
                  onMouseLeave={e => e.currentTarget.style.background = "#f6fcff"}
                >
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3", textAlign: "center" }}>{prod.id}</td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3", textAlign: "center" }}>
                    <img 
                      src={prod.imagen} 
                      alt={prod.nombre}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid #e0e0e0"
                      }}
                    />
                  </td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3" }}>{prod.nombre}</td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3", fontSize: "14px", color: "#666" }}>
                    {prod.descripcion}
                  </td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3", textAlign: "center", fontWeight: 600 }}>
                    S/ {prod.precio.toFixed(2)}
                  </td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3", textAlign: "center" }}>
                    <span style={{
                      background: prod.stock > 0 ? "#d4edda" : "#f8d7da",
                      color: prod.stock > 0 ? "#155724" : "#721c24",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontWeight: 600,
                      fontSize: "14px"
                    }}>
                      {prod.stock}
                    </span>
                  </td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3" }}>{prod.categoria.nombre}</td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3", textAlign: "center" }}>
                    <button
                      style={{
                        background: "#377dff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        padding: "6px 14px",
                        marginRight: "8px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                      onClick={() => handleOpenUpdateModal(prod)}
                    >
                      Actualizar
                    </button>
                    <button
                      style={{
                        background: "#ff6b6b",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        padding: "6px 14px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                      onClick={() => handleOpenDeleteModal(prod)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={handleCloseModal}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0px 8px 32px rgba(0,0,0,0.2)",
              zIndex: 1000,
              width: "90%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #e5e7eb",
                background: "#377dff",
                color: "#fff",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>
                {modalMode === "create" ? "Añadir Producto" : "Actualizar Producto"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 600,
                      color: "#374151",
                      fontSize: "14px",
                    }}
                  >
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ingrese el nombre"
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "15px",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#377dff"}
                    onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 600,
                      color: "#374151",
                      fontSize: "14px",
                    }}
                  >
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Ingrese la descripción"
                    required
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "15px",
                      outline: "none",
                      transition: "border-color 0.2s",
                      resize: "vertical",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#377dff"}
                    onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 600,
                        color: "#374151",
                        fontSize: "14px",
                      }}
                    >
                      Precio (S/)
                    </label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                      step="0.01"
                      min="0"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "15px",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#377dff"}
                      onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 600,
                        color: "#374151",
                        fontSize: "14px",
                      }}
                    >
                      Stock
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                      min="0"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "15px",
                        outline: "none",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#377dff"}
                      onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 600,
                      color: "#374151",
                      fontSize: "14px",
                    }}
                  >
                    Categoría
                  </label>
                  <select
                    name="categoriaId"
                    value={formData.categoriaId}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "15px",
                      outline: "none",
                      transition: "border-color 0.2s",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#377dff"}
                    onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: 600,
                      color: "#374151",
                      fontSize: "14px",
                    }}
                  >
                    Imagen {modalMode === "create" ? "(Requerida)" : "(Opcional)"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "15px",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  />
                  {imagePreview && (
                    <div style={{ marginTop: "12px", textAlign: "center" }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          objectFit: "contain",
                          borderRadius: "8px",
                          border: "2px solid #e5e7eb",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  padding: "16px 24px",
                  borderTop: "1px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  background: "#f9fafb",
                }}
              >
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: "#fff",
                    color: "#374151",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    background: "#377dff",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {modalMode === "create" ? "Crear Producto" : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {showDeleteModal && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={handleCancelDelete}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0px 8px 32px rgba(0,0,0,0.2)",
              zIndex: 1000,
              width: "90%",
              maxWidth: "450px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #e5e7eb",
                background: "#ff6b6b",
                color: "#fff",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>
                Confirmar Eliminación
              </h2>
            </div>
            <div style={{ padding: "24px" }}>
              <p style={{ margin: 0, color: "#374151", fontSize: "15px", lineHeight: "1.6" }}>
                ¿Estás seguro de que deseas eliminar el producto <strong>"{currentProducto?.nombre}"</strong>? Esta acción no se puede deshacer.
              </p>
            </div>
            <div
              style={{
                padding: "16px 24px",
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                background: "#f9fafb",
              }}
            >
              <button
                onClick={handleCancelDelete}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  background: "#fff",
                  color: "#374151",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "6px",
                  background: "#ff6b6b",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}