import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSignOutAlt, FaBox, FaIdCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import OrderCard from "../components/OrderCard";
import { useAuth, useAuthActions } from "../hooks/useAuth";
import { usePedidosCliente } from "../hooks/usePedidosCliente";
import { useBoletas } from "../hooks/useBoletas";

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [userData, setUserData] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [boletasDisponibles, setBoletasDisponibles] = useState({});

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        const profileResponse = await useAuthActions.getProfile(false);
        setUserData(profileResponse.data);

        const pedidosData = await usePedidosCliente.listar();
        
        const pedidosConHistorial = await Promise.all(
          pedidosData.map(async (pedido) => {
            try {
              const historial = await usePedidosCliente.verHistorial(pedido.id);
              return { ...pedido, historial: historial || [] };
            } catch (error) {
              console.error(`Error al cargar historial del pedido ${pedido.id}:`, error);
              return { ...pedido, historial: [] };
            }
          })
        );

        setPedidos(pedidosConHistorial);

        const disponibilidad = {};
        await Promise.all(
          pedidosConHistorial.map(async (pedido) => {
            try {
              const result = await useBoletas.verificarDisponibilidad(pedido.id);
              disponibilidad[pedido.id] = result.data?.disponible || false;
            } catch (error) {
              disponibilidad[pedido.id] = false;
            }
          })
        );
        setBoletasDisponibles(disponibilidad);

      } catch (error) {
        console.error("Error al cargar datos del perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const descargarBoleta = async (pedido) => {
    try {
      const blob = await useBoletas.descargarBoleta(pedido.id);
      
      if (!blob || !(blob instanceof Blob)) {
        console.error("El response no es un Blob válido:", blob);
        toast.error("Error: archivo no válido");
        return;
      }
    
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `boleta_pedido_${pedido.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar boleta:", error);
    }
  };  

  const cerrarSesion = () => {
    logout(); 
    navigate("/LogIn");
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={styles.loadingState}>
            <p>Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <div style={styles.errorState}>
            <p>No se pudo cargar la información del perfil</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Mi Perfil</h1>
        </div>

        <div style={styles.content}>
          <div style={styles.profileSection}>
            <div style={styles.profileCard}>
              <div style={styles.avatarContainer}>
                <div style={styles.avatar}>
                  <FaUser size={50} color="#d28f56" />
                </div>
              </div>
              
              <h2 style={styles.userName}>
                {userData.nombre} {userData.apellido}
              </h2>

              <div style={styles.infoGrid}>
                <div style={styles.infoItem}>
                  <div style={styles.infoIconWrapper}>
                    <FaEnvelope style={styles.infoIcon} />
                  </div>
                  <div style={styles.infoContent}>
                    <span style={styles.infoLabel}>Email</span>
                    <span style={styles.infoValue}>{userData.correo}</span>
                  </div>
                </div>

                <div style={styles.infoItem}>
                  <div style={styles.infoIconWrapper}>
                    <FaPhone style={styles.infoIcon} />
                  </div>
                  <div style={styles.infoContent}>
                    <span style={styles.infoLabel}>Teléfono</span>
                    <span style={styles.infoValue}>{userData.celular}</span>
                  </div>
                </div>

                <div style={styles.infoItem}>
                  <div style={styles.infoIconWrapper}>
                    <FaIdCard style={styles.infoIcon} />
                  </div>
                  <div style={styles.infoContent}>
                    <span style={styles.infoLabel}>DNI</span>
                    <span style={styles.infoValue}>{userData.dni}</span>
                  </div>
                </div>

                <div style={styles.infoItem}>
                  <div style={styles.infoIconWrapper}>
                    <FaMapMarkerAlt style={styles.infoIcon} />
                  </div>
                  <div style={styles.infoContent}>
                    <span style={styles.infoLabel}>Dirección</span>
                    <span style={styles.infoValue}>{userData.direccion}</span>
                  </div>
                </div>
              </div>

              <button onClick={cerrarSesion} style={styles.logoutBtn}>
                <FaSignOutAlt style={{ marginRight: "8px" }} />
                Cerrar Sesión
              </button>
            </div>
          </div>

          <div style={styles.ordersSection}>
            <h2 style={styles.sectionTitle}>
              <FaBox style={{ marginRight: "10px" }} />
              Mis Pedidos
            </h2>

            {pedidos.length === 0 ? (
              <div style={styles.emptyState}>
                <FaBox size={60} color="#ccc" />
                <p style={styles.emptyText}>No tienes pedidos registrados</p>
              </div>
            ) : (
              <div style={styles.ordersList}>
                {pedidos.map((pedido) => (
                  <OrderCard 
                    key={pedido.id} 
                    pedido={pedido} 
                    onDescargarBoleta={descargarBoleta}
                    boletaDisponible={boletasDisponibles[pedido.id] || false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
    paddingTop: "100px",
  },
  wrapper: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#333",
    margin: 0,
  },
  content: {
    display: "grid",
    gridTemplateColumns: "350px 1fr",
    gap: "25px",
  },
  profileSection: {
    height: "fit-content",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "#fff8f0",
    border: "3px solid #d28f56",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "25px",
  },
  infoGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "25px",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    border: "1px solid #eee",
  },
  infoIconWrapper: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    backgroundColor: "#fff8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoIcon: {
    fontSize: "18px",
    color: "#d28f56",
  },
  infoContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  infoLabel: {
    display: "block",
    fontSize: "12px",
    color: "#888",
    fontWeight: "500",
    textAlign: "left",
  },
  infoValue: {
    display: "block",
    fontSize: "14px",
    color: "#333",
    fontWeight: "600",
    textAlign: "left",
  },
  logoutBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d9534f",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(217, 83, 79, 0.3)",
  },
  ordersSection: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "25px",
    display: "flex",
    alignItems: "center",
  },
  ordersList: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    gap: "15px",
  },
  emptyText: {
    fontSize: "16px",
    color: "#999",
  },
  loadingState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    fontSize: "18px",
    color: "#666",
  },
  errorState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    fontSize: "18px",
    color: "#d9534f",
  },
};

export default Profile;