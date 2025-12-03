import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import ScrollToTop from "./components/ScrollTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Inicio from "./pages/Inicio";
import Nosotros from "./pages/Nosotros";
import Tienda from "./pages/Tienda";
import Testimonios from "./pages/Testimonios";
import Galeria from "./pages/Galeria";
import Locales from "./pages/Locales";
import Contactanos from "./pages/Contactanos";
import LogIN from "./pages/LogIn";
import Register from "./pages/Register";
import Privacidad from "./pages/Privacidad";
import Reclamaciones from "./pages/Reclamaciones";
import Terminos from "./pages/Terminos";
import LogInAdmin from "./pages/LogInAdmin";
import LogInVendedor from "./pages/LogInVendedor";
import Profile from "./pages/Profile";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import VendedorLayout from "./layouts/VendedorLayout";

import Dashboard from "./pages/admin/Dashboard";
import Usuarios from "./pages/admin/Usuarios";
import Categorias from "./pages/admin/Categorias";
import Productos from "./pages/admin/Productos";
import PedidosAdmin from "./pages/admin/PedidosAdmin";

import PedidosVendedor from "./pages/vendedor/PedidosVendedor";
import VerificarPagos from "./pages/vendedor/VerificarPagos";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/Nosotros" element={<Nosotros />} />
          <Route path="/Tienda" element={<Tienda />} />
          <Route path="/Testimonios" element={<Testimonios />} />
          <Route path="/Galeria" element={<Galeria />} />
          <Route path="/Locales" element={<Locales />} />
          <Route path="/Contactanos" element={<Contactanos />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/reclamaciones" element={<Reclamaciones />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/LogIn" element={
            <PublicRoute role="cliente">
              <LogIN />
            </PublicRoute>
          } />
          <Route path="/login-admin" element={
            <PublicRoute role="admin">
              <LogInAdmin />
            </PublicRoute>
          } />
          <Route path="/login-vendedor" element={
            <PublicRoute role="vendedor">
              <LogInVendedor />
            </PublicRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute role="cliente">
              <Profile />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="productos" element={<Productos />} />
          <Route path="pedidos" element={<PedidosAdmin />} />
        </Route>

        <Route path="/vendedor" element={
          <ProtectedRoute role="vendedor">
            <VendedorLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/vendedor/pedidos" replace />} />
          <Route path="pedidos" element={<PedidosVendedor />} />
          <Route path="verificar-pagos" element={<VerificarPagos />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </Router>
  );
}

export default App;