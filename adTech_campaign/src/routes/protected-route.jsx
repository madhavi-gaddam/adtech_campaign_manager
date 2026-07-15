import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContextValue";

export function ProtectedRoute({ roles }) {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  if (!currentUser) return <Navigate to="/signup" replace state={{ from: location }} />;
  if (roles && !roles.includes(currentUser.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
