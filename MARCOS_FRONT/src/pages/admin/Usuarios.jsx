import React, { useEffect, useState } from "react";
import { useUsuarios } from "../../hooks/useUsuarios";
import { useAuthActions } from "../../hooks/useAuth";
import { Validators } from "../../utils/validators";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [searchDni, setSearchDni] = useState("");
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState("");
  const [modalType, setModalType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    celular: "",
    direccion: "",
    dni: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const res = await useUsuarios.listar();
        setUsuarios(res.data);
        setFilteredUsuarios(res.data);
      } catch {}
    }
    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (searchDni.trim() === "") {
      setFilteredUsuarios(usuarios);
    } else {
      setFilteredUsuarios(
        usuarios.filter((u) =>
          u.dni.toLowerCase().includes(searchDni.toLowerCase())
        )
      );
    }
  }, [searchDni, usuarios]);

  const handleActualizar = (user) => {
    setModalType("actualizar");
    setSelectedUser(user);
    setForm({
      nombre: user.nombre,
      apellido: user.apellido,
      celular: user.celular,
      direccion: user.direccion,
    });
    setErrors({});
    setTouched({});
    setModalOpen(true);
  };

  const handleEliminar = (user) => {
    setModalType("eliminar");
    setSelectedUser(user);
    setModalOpen(true);
  };

  const confirmEliminar = async () => {
    try {
      await useUsuarios.eliminar(selectedUser.id);
      setUsuarios((prev) => prev.filter((u) => u.id !== selectedUser.id));
      closeModal();
    } catch {}
  };

  const openModal = (role) => {
    setModalType("crear");
    setModalRole(role);
    setForm({
      nombre: "",
      apellido: "",
      correo: "",
      password: "",
      celular: "",
      direccion: "",
      dni: "",
    });
    setErrors({});
    setTouched({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalRole("");
    setModalType("");
    setSelectedUser(null);
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "nombre":
      case "apellido":
        error = Validators.validateName(value);
        break;
      case "correo":
        error = Validators.validateEmail(value);
        break;
      case "celular":
        error = Validators.validateCelular(value);
        break;
      case "direccion":
        error = Validators.validateDireccion(value);
        break;
      case "dni":
        error = Validators.validateDNI(value);
        break;
      case "password":
        error = Validators.validatePassword(value);
        break;
      default:
        break;
    }
    return error;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleFocus = (e) => {
    if (modalType === "crear") {
      e.target.style.borderColor = modalRole === "admin" ? "#377dff" : "#50c878";
    } else {
      e.target.style.borderColor = "#377dff";
    }
  };

  const handleBlurStyle = (e, fieldName) => {
    handleBlur(e);
    e.target.style.borderColor = touched[fieldName] && errors[fieldName] ? "#fc8181" : "#e2e8f0";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modalType === "actualizar") {
      const updateFields = ["nombre", "apellido", "celular", "direccion"];
      const allTouched = {};
      const allErrors = {};
      updateFields.forEach((key) => {
        allTouched[key] = true;
        const error = validateField(key, form[key]);
        if (error) allErrors[key] = error;
      });

      setTouched(allTouched);
      setErrors(allErrors);

      if (Object.keys(allErrors).length > 0) return;

      try {
        const updateData = {
          nombre: form.nombre,
          apellido: form.apellido,
          celular: form.celular,
          direccion: form.direccion,
        };
        await useUsuarios.actualizar(selectedUser.id, updateData);
        const res = await useUsuarios.listar();
        setUsuarios(res.data);
        setFilteredUsuarios(res.data);
        closeModal();
      } catch {}
    } else {
      const allTouched = {};
      const allErrors = {};
      Object.keys(form).forEach((key) => {
        allTouched[key] = true;
        const error = validateField(key, form[key]);
        if (error) allErrors[key] = error;
      });

      setTouched(allTouched);
      setErrors(allErrors);

      if (Object.keys(allErrors).length > 0) return;

      try {
        if (modalRole === "admin") {
          await useAuthActions.registerAdmin(form);
        } else if (modalRole === "vendedor") {
          await useAuthActions.registerVendedor(form);
        }
        closeModal();
        const res = await useUsuarios.listar();
        setUsuarios(res.data);
        setFilteredUsuarios(res.data);
      } catch {}
    }
  };

  const isFormValid = () => {
    if (modalType === "actualizar") {
      const updateFields = ["nombre", "apellido", "celular", "direccion"];
      return updateFields.every((key) => {
        const error = validateField(key, form[key]);
        return !error;
      });
    }
    return Object.keys(form).every((key) => {
      const error = validateField(key, form[key]);
      return !error;
    });
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
            Gestión de Usuarios
          </h1>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            style={{
              background: "#377dff",
              color: "#fff",
              padding: "8px 20px",
              borderRadius: "6px",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0px 1px 4px rgba(0,0,0,0.08)",
            }}
            onClick={() => openModal("admin")}
          >
            Agregar Admin
          </button>
          <button
            style={{
              background: "#50c878",
              color: "#fff",
              padding: "8px 20px",
              borderRadius: "6px",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0px 1px 4px rgba(0,0,0,0.08)",
            }}
            onClick={() => openModal("vendedor")}
          >
            Agregar Vendedor
          </button>
        </div>
      </div>
      <div style={{ margin: "24px 0 16px 0" }}>
        <input
          type="text"
          placeholder="Buscar por DNI"
          value={searchDni}
          onChange={(e) => setSearchDni(e.target.value)}
          style={{
            padding: "10px 16px",
            width: "260px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "16px",
            boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
            marginBottom: "8px",
          }}
        />
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
            minWidth: "900px",
          }}
        >
          <thead>
            <tr style={{ background: "#377dff0d", color: "#444" }}>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db" }}>ID</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db" }}>Nombre</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db" }}>Apellido</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db" }}>Celular</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db" }}>Correo</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db" }}>Dirección</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db" }}>DNI</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db" }}>Rol</th>
              <th style={{ padding: "14px 8px", borderBottom: "1px solid #d1d5db" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "24px", color: "#bdbdbd" }}>
                  No hay usuarios
                </td>
              </tr>
            ) : (
              filteredUsuarios.map((u) => (
                <tr
                  key={u.id}
                  style={{
                    background: "#f6fcff",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#e7f2fe"}
                  onMouseLeave={e => e.currentTarget.style.background = "#f6fcff"}
                >
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3" }}>{u.id}</td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3" }}>{u.nombre}</td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3" }}>{u.apellido}</td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3" }}>{u.celular}</td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3" }}>{u.correo}</td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3" }}>{u.direccion}</td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3" }}>{u.dni}</td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3" }}>{u.role}</td>
                  <td style={{ padding: "12px 8px", borderBottom: "1px solid #eef0f3" }}>
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
                      onClick={() => handleActualizar(u)}
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
                      onClick={() => handleEliminar(u)}
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
      {modalOpen && modalType === "eliminar" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(2px)",
            animation: "fadeIn 0.2s ease-in-out",
          }}
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)",
              padding: "36px 32px",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              minWidth: "420px",
              maxWidth: "480px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              position: "relative",
              border: "1px solid rgba(255,255,255,0.8)",
              animation: "slideUp 0.3s ease-out",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "#fee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#e53e3e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <h2
                style={{
                  margin: "0 0 8px 0",
                  color: "#1a202c",
                  fontSize: "24px",
                  fontWeight: 700,
                }}
              >
                Confirmar Eliminación
              </h2>
              <p style={{ margin: 0, color: "#718096", fontSize: "15px", lineHeight: "1.5" }}>
                ¿Estás seguro de que deseas eliminar a <strong>{selectedUser?.nombre} {selectedUser?.apellido}</strong>?
              </p>
              <p style={{ margin: "8px 0 0 0", color: "#e53e3e", fontSize: "14px", fontWeight: 600 }}>
                Esta acción no se puede deshacer
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: "#e2e8f0",
                  color: "#4a5568",
                  border: "none",
                  borderRadius: "8px",
                  padding: "11px 28px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "15px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#cbd5e0")}
                onMouseLeave={(e) => (e.target.style.background = "#e2e8f0")}
              >
                Cancelar
              </button>
              <button
                onClick={confirmEliminar}
                style={{
                  background: "#e53e3e",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "11px 28px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "15px",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 12px rgba(229, 62, 62, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(229, 62, 62, 0.4)";
                  e.target.style.background = "#c53030";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(229, 62, 62, 0.3)";
                  e.target.style.background = "#e53e3e";
                }}
              >
                Eliminar Usuario
              </button>
            </div>
          </div>
        </div>
      )}
      {modalOpen && modalType === "actualizar" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(2px)",
            animation: "fadeIn 0.2s ease-in-out",
          }}
          onClick={closeModal}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fc 100%)",
              padding: "40px 36px",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              minWidth: "480px",
              maxWidth: "520px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              position: "relative",
              border: "1px solid rgba(255,255,255,0.8)",
              animation: "slideUp 0.3s ease-out",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <h2
                style={{
                  margin: "0 0 6px 0",
                  color: "#1a202c",
                  fontSize: "26px",
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                }}
              >
                Actualizar Usuario
              </h2>
              <p style={{ margin: 0, color: "#718096", fontSize: "14px" }}>
                Modifique los datos del usuario
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                  Nombre <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleFormChange}
                  onBlur={(e) => handleBlurStyle(e, "nombre")}
                  onFocus={handleFocus}
                  placeholder="Ingrese nombre"
                  style={{
                    padding: "11px 14px",
                    borderRadius: "8px",
                    border: touched.nombre && errors.nombre ? "2px solid #fc8181" : "1px solid #e2e8f0",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.2s",
                    background: "#fff",
                  }}
                />
                {touched.nombre && errors.nombre && (
                  <span style={{ fontSize: "12px", color: "#e53e3e", marginTop: "4px" }}>{errors.nombre}</span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                  Apellido <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  name="apellido"
                  value={form.apellido}
                  onChange={handleFormChange}
                  onBlur={(e) => handleBlurStyle(e, "apellido")}
                  onFocus={handleFocus}
                  placeholder="Ingrese apellido"
                  style={{
                    padding: "11px 14px",
                    borderRadius: "8px",
                    border: touched.apellido && errors.apellido ? "2px solid #fc8181" : "1px solid #e2e8f0",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.2s",
                    background: "#fff",
                  }}
                />
                {touched.apellido && errors.apellido && (
                  <span style={{ fontSize: "12px", color: "#e53e3e", marginTop: "4px" }}>{errors.apellido}</span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                Celular <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <input
                name="celular"
                value={form.celular}
                onChange={handleFormChange}
                onBlur={(e) => handleBlurStyle(e, "celular")}
                onFocus={handleFocus}
                placeholder="987654321"
                maxLength="9"
                style={{
                  padding: "11px 14px",
                  borderRadius: "8px",
                  border: touched.celular && errors.celular ? "2px solid #fc8181" : "1px solid #e2e8f0",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.2s",
                  background: "#fff",
                }}
              />
              {touched.celular && errors.celular && (
                <span style={{ fontSize: "12px", color: "#e53e3e", marginTop: "4px" }}>{errors.celular}</span>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                Dirección <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <input
                name="direccion"
                value={form.direccion}
                onChange={handleFormChange}
                onBlur={(e) => handleBlurStyle(e, "direccion")}
                onFocus={handleFocus}
                placeholder="Av. Principal 123"
                style={{
                  padding: "11px 14px",
                  borderRadius: "8px",
                  border: touched.direccion && errors.direccion ? "2px solid #fc8181" : "1px solid #e2e8f0",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.2s",
                  background: "#fff",
                }}
              />
              {touched.direccion && errors.direccion && (
                <span style={{ fontSize: "12px", color: "#e53e3e", marginTop: "4px" }}>{errors.direccion}</span>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: "#e2e8f0",
                  color: "#4a5568",
                  border: "none",
                  borderRadius: "8px",
                  padding: "11px 24px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "15px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#cbd5e0")}
                onMouseLeave={(e) => (e.target.style.background = "#e2e8f0")}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isFormValid()}
                style={{
                  background: isFormValid() ? "#377dff" : "#cbd5e0",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "11px 28px",
                  fontWeight: 600,
                  cursor: isFormValid() ? "pointer" : "not-allowed",
                  fontSize: "15px",
                  transition: "all 0.2s",
                  boxShadow: isFormValid() ? "0 4px 12px rgba(55, 125, 255, 0.3)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (isFormValid()) {
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(55, 125, 255, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = isFormValid() ? "0 4px 12px rgba(55, 125, 255, 0.3)" : "none";
                }}
              >
                Actualizar Usuario
              </button>
            </div>
          </form>
        </div>
      )}
      {modalOpen && modalType === "crear" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(2px)",
            animation: "fadeIn 0.2s ease-in-out",
          }}
          onClick={closeModal}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fc 100%)",
              padding: "40px 36px",
              borderRadius: "16px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              minWidth: "480px",
              maxWidth: "520px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              position: "relative",
              border: "1px solid rgba(255,255,255,0.8)",
              animation: "slideUp 0.3s ease-out",
            }}
          >
            <div style={{ marginBottom: "8px" }}>
              <h2
                style={{
                  margin: "0 0 6px 0",
                  color: "#1a202c",
                  fontSize: "26px",
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                }}
              >
                {modalRole === "admin" ? "Nuevo Administrador" : "Nuevo Vendedor"}
              </h2>
              <p style={{ margin: 0, color: "#718096", fontSize: "14px" }}>
                Complete los campos para registrar un nuevo {modalRole === "admin" ? "administrador" : "vendedor"}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                  Nombre <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleFormChange}
                  onBlur={(e) => handleBlurStyle(e, "nombre")}
                  onFocus={handleFocus}
                  placeholder="Ingrese nombre"
                  style={{
                    padding: "11px 14px",
                    borderRadius: "8px",
                    border: touched.nombre && errors.nombre ? "2px solid #fc8181" : "1px solid #e2e8f0",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.2s",
                    background: "#fff",
                  }}
                />
                {touched.nombre && errors.nombre && (
                  <span style={{ fontSize: "12px", color: "#e53e3e", marginTop: "4px" }}>{errors.nombre}</span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                  Apellido <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  name="apellido"
                  value={form.apellido}
                  onChange={handleFormChange}
                  onBlur={(e) => handleBlurStyle(e, "apellido")}
                  onFocus={handleFocus}
                  placeholder="Ingrese apellido"
                  style={{
                    padding: "11px 14px",
                    borderRadius: "8px",
                    border: touched.apellido && errors.apellido ? "2px solid #fc8181" : "1px solid #e2e8f0",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.2s",
                    background: "#fff",
                  }}
                />
                {touched.apellido && errors.apellido && (
                  <span style={{ fontSize: "12px", color: "#e53e3e", marginTop: "4px" }}>{errors.apellido}</span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                Correo Electrónico <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleFormChange}
                onBlur={(e) => handleBlurStyle(e, "correo")}
                onFocus={handleFocus}
                placeholder="ejemplo@correo.com"
                style={{
                  padding: "11px 14px",
                  borderRadius: "8px",
                  border: touched.correo && errors.correo ? "2px solid #fc8181" : "1px solid #e2e8f0",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.2s",
                  background: "#fff",
                }}
              />
              {touched.correo && errors.correo && (
                <span style={{ fontSize: "12px", color: "#e53e3e", marginTop: "4px" }}>{errors.correo}</span>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                  DNI <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  name="dni"
                  value={form.dni}
                  onChange={handleFormChange}
                  onBlur={(e) => handleBlurStyle(e, "dni")}
                  onFocus={handleFocus}
                  placeholder="12345678"
                  maxLength="8"
                  style={{
                    padding: "11px 14px",
                    borderRadius: "8px",
                    border: touched.dni && errors.dni ? "2px solid #fc8181" : "1px solid #e2e8f0",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.2s",
                    background: "#fff",
                  }}
                />
                {touched.dni && errors.dni && (
                  <span style={{ fontSize: "12px", color: "#e53e3e", marginTop: "4px" }}>{errors.dni}</span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                  Celular <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  name="celular"
                  value={form.celular}
                  onChange={handleFormChange}
                  onBlur={(e) => handleBlurStyle(e, "celular")}
                  onFocus={handleFocus}
                  placeholder="987654321"
                  maxLength="9"
                  style={{
                    padding: "11px 14px",
                    borderRadius: "8px",
                    border: touched.celular && errors.celular ? "2px solid #fc8181" : "1px solid #e2e8f0",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.2s",
                    background: "#fff",
                  }}
                />
                {touched.celular && errors.celular && (
                  <span style={{ fontSize: "12px", color: "#e53e3e", marginTop: "4px" }}>{errors.celular}</span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                Dirección <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <input
                name="direccion"
                value={form.direccion}
                onChange={handleFormChange}
                onBlur={(e) => handleBlurStyle(e, "direccion")}
                onFocus={handleFocus}
                placeholder="Av. Principal 123"
                style={{
                  padding: "11px 14px",
                  borderRadius: "8px",
                  border: touched.direccion && errors.direccion ? "2px solid #fc8181" : "1px solid #e2e8f0",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.2s",
                  background: "#fff",
                }}
              />
              {touched.direccion && errors.direccion && (
                <span style={{ fontSize: "12px", color: "#e53e3e", marginTop: "4px" }}>{errors.direccion}</span>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#4a5568", marginBottom: "6px" }}>
                Contraseña <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <input
                name="password"
                value={form.password}
                onChange={handleFormChange}
                onBlur={(e) => handleBlurStyle(e, "password")}
                onFocus={handleFocus}
                placeholder="Mínimo 6 caracteres"
                type="password"
                style={{
                  padding: "11px 14px",
                  borderRadius: "8px",
                  border: touched.password && errors.password ? "2px solid #fc8181" : "1px solid #e2e8f0",
                  fontSize: "15px",
                  outline: "none",
                  transition: "all 0.2s",
                  background: "#fff",
                }}
              />
              {touched.password && errors.password && (
                <span style={{ fontSize: "12px", color: "#e53e3e", marginTop: "4px" }}>{errors.password}</span>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: "#e2e8f0",
                  color: "#4a5568",
                  border: "none",
                  borderRadius: "8px",
                  padding: "11px 24px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "15px",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#cbd5e0")}
                onMouseLeave={(e) => (e.target.style.background = "#e2e8f0")}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isFormValid()}
                style={{
                  background: isFormValid()
                    ? modalRole === "admin"
                      ? "#377dff"
                      : "#50c878"
                    : "#cbd5e0",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "11px 28px",
                  fontWeight: 600,
                  cursor: isFormValid() ? "pointer" : "not-allowed",
                  fontSize: "15px",
                  transition: "all 0.2s",
                  boxShadow: isFormValid() ? "0 4px 12px rgba(55, 125, 255, 0.3)" : "none",
                }}
                onMouseEnter={(e) => {
                  if (isFormValid()) {
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(55, 125, 255, 0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = isFormValid() ? "0 4px 12px rgba(55, 125, 255, 0.3)" : "none";
                }}
              >
                Registrar {modalRole === "admin" ? "Admin" : "Vendedor"}
              </button>
            </div>
          </form>
        </div>
      )}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}