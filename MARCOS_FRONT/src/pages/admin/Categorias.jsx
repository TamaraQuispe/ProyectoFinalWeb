import React, { useEffect, useState } from "react";
import { useCategories } from "../../hooks/useCategories";

export default function Categorias() {
  const { categorias, fetchCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } = useCategories();
  const [filteredCategorias, setFilteredCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [formData, setFormData] = useState({ nombre: "" });

  useEffect(() => {
    async function loadCategorias() {
      try {
        await fetchCategorias();
      } catch {}
    }
    loadCategorias();
  }, []);

  useEffect(() => {
    const sorted = [...categorias].sort((a, b) => b.id - a.id);
    setFilteredCategorias(sorted);
  }, [categorias]);

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setFormData({ nombre: "" });
    setCurrentCategoria(null);
    setShowModal(true);
  };

  const handleOpenUpdateModal = (categoria) => {
    setModalMode("update");
    setFormData({ nombre: categoria.nombre });
    setCurrentCategoria(categoria);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ nombre: "" });
    setCurrentCategoria(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        await crearCategoria(formData);
      } else {
        await actualizarCategoria(currentCategoria.id, formData);
      }
      await fetchCategorias();
      handleCloseModal();
    } catch {}
  };

  const handleOpenDeleteModal = (categoria) => {
    setCurrentCategoria(categoria);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await eliminarCategoria(currentCategoria.id);
      setShowDeleteModal(false);
      setCurrentCategoria(null);
    } catch {}
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCurrentCategoria(null);
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
            Gestión de Categorías
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
            Añadir Categoría
          </button>
        </div>
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
            minWidth: "600px",
          }}
        >
          <thead>
            <tr style={{ background: "#377dff0d", color: "#444" }}>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db", width: "15%" }}>ID</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db", width: "50%" }}>Nombre</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db", width: "35%" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategorias.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", padding: "24px", color: "#bdbdbd" }}>
                  No hay categorías
                </td>
              </tr>
            ) : (
              filteredCategorias.map((cat) => (
                <tr
                  key={cat.id}
                  style={{
                    background: "#f6fcff",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#e7f2fe"}
                  onMouseLeave={e => e.currentTarget.style.background = "#f6fcff"}
                >
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3", textAlign: "center" }}>{cat.id}</td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3" }}>{cat.nombre}</td>
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
                      onClick={() => handleOpenUpdateModal(cat)}
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
                      onClick={() => handleOpenDeleteModal(cat)}
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
              maxWidth: "500px",
              overflow: "hidden",
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
                {modalMode === "create" ? "Añadir Categoría" : "Actualizar Categoría"}
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ padding: "24px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                    color: "#374151",
                    fontSize: "14px",
                  }}
                >
                  Nombre de la Categoría
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ nombre: e.target.value })}
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
                  {modalMode === "create" ? "Crear" : "Guardar Cambios"}
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
                ¿Estás seguro de que deseas eliminar la categoría <strong>"{currentCategoria?.nombre}"</strong>? Esta acción no se puede deshacer.
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