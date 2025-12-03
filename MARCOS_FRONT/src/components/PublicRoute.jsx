import { Navigate } from "react-router-dom";

function PublicRoute({ children, role }) {
  let token;

  switch (role) {
    case "cliente":
      token = localStorage.getItem("token");
      break;
    case "vendedor":
    case "admin":
      token = localStorage.getItem("adminToken");
      break;
    default:
      token = null;
  }

  const redirectRoute = {
    cliente: "/profile",
    vendedor: "/vendedor/productos",
    admin: "/admin/dashboard",
  }[role];

  return token ? <Navigate to={redirectRoute} replace /> : children;
}

export default PublicRoute;