import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  let token;

  switch (role) {
    case "cliente":
      token = localStorage.getItem("token");
      break;
    case "vendedor":
      token = localStorage.getItem("adminToken");
      break;
    case "admin":
      token = localStorage.getItem("adminToken");
      break;
    default:
      token = null;
  }

  const loginRoute = {
    cliente: "/login",
    vendedor: "/login-vendedor",
    admin: "/login-admin",
  }[role];

  return token ? children : <Navigate to={loginRoute} replace />;
}

export default ProtectedRoute;