import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiUser,
  FiMail,
  FiCreditCard,
  FiLogOut,
} from "react-icons/fi";
import logo from "../assets/logohorizontal.jpg";
import { useAuth, useAuthActions } from "../hooks/useAuth";

export default function SidebarAdmin({ isOpen, setIsOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await useAuthActions.getProfile(true);
        if (response.data) {
          setProfileData(response.data);
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login-admin");
  };

  const userInfo = profileData
    ? [
        { icon: <FiCreditCard size={18} />, value: profileData.dni },
        { icon: <FiUser size={18} />, value: `${profileData.nombre} ${profileData.apellido}` },
        { icon: <FiMail size={18} />, value: profileData.correo },
      ]
    : [
        { icon: <FiCreditCard size={18} />, value: "Cargando..." },
        { icon: <FiUser size={18} />, value: "Cargando..." },
        { icon: <FiMail size={18} />, value: "Cargando..." },
      ];

  const menuItems = [
    { title: "Dashboard", icon: <FiHome size={20} />, path: "/admin/dashboard" },
    { title: "Usuarios", icon: <FiUsers size={20} />, path: "/admin/usuarios" },
    { title: "Categorías", icon: <FiGrid size={20} />, path: "/admin/categorias" },
    { title: "Productos", icon: <FiPackage size={20} />, path: "/admin/productos" },
    { title: "Pedidos", icon: <FiShoppingCart size={20} />, path: "/admin/pedidos" },
  ];

  return (
    <div
      style={{
        width: isOpen ? "240px" : "80px",
        height: "100vh",
        backgroundColor: "#fef5f7",
        position: "fixed",
        left: 0,
        top: 0,
        transition: "width 0.3s ease",
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 15px rgba(0,0,0,0.08)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          padding: isOpen ? "1.5rem 1rem" : "1.5rem 0.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "2px solid #ffd6e0",
          minHeight: "100px",
          backgroundColor: "#fff",
        }}
      >
        <img
          src={logo}
          alt="D'Julia Logo"
          style={{
            width: isOpen ? "140px" : "50px",
            height: "auto",
            objectFit: "contain",
            transition: "all 0.3s ease",
            borderRadius: "8px",
          }}
        />
        {isOpen && (
          <p
            style={{
              margin: "0.75rem 0 0 0",
              fontSize: "0.9rem",
              color: "#d4526e",
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Panel Admin
          </p>
        )}
      </div>

      <nav style={{ flex: 1, padding: "1rem 0", overflowY: "auto" }}>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              padding: isOpen ? "0.875rem 1.25rem" : "0.875rem 0",
              justifyContent: isOpen ? "flex-start" : "center",
              color: isActive ? "#d4526e" : "#5a4a4e",
              backgroundColor: isActive ? "#ffe8ed" : "transparent",
              textDecoration: "none",
              transition: "all 0.2s ease",
              borderLeft: isActive ? "4px solid #d4526e" : "4px solid transparent",
              marginBottom: "0.25rem",
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains("active")) {
                e.currentTarget.style.backgroundColor = "#fff0f3";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains("active")) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>
            {isOpen && (
              <span
                style={{
                  marginLeft: "1rem",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                }}
              >
                {item.title}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div
        style={{
          padding: isOpen ? "1.25rem 1rem" : "1rem 0.5rem",
          borderTop: "2px solid #ffd6e0",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        {isOpen
          ? userInfo.map((info, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  width: "100%",
                }}
              >
                <span style={{ color: "#d4526e", display: "flex" }}>{info.icon}</span>
                <span
                  style={{
                    color: "#2c2c2c",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                    textAlign: "left",
                  }}
                >
                  {info.value}
                </span>
              </div>
            ))
          : userInfo.map((info, index) => (
              <span key={index} style={{ color: "#d4526e", display: "flex" }}>
                {info.icon}
              </span>
            ))}

        {isOpen && (
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "0.75rem",
              marginTop: "0.5rem",
              backgroundColor: "#d4526e",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#bf3c59")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#d4526e")}
          >
            <FiLogOut size={18} />
            Cerrar Sesión
          </button>
        )}
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "1rem",
          backgroundColor: "#ffb3c6",
          border: "none",
          color: "#8c2f47",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          borderTop: "2px solid #ffd6e0",
          fontWeight: "600",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#ff99b3";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#ffb3c6";
        }}
      >
        {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
      </button>
    </div>
  );
}