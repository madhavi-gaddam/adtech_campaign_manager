import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextValue";

export function RequireAuth({ children, roles }) {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  if (!currentUser) return <Navigate to="/signup" replace state={{ from: location }} />;
  if (roles && !roles.includes(currentUser.role)) return <Navigate to="/" replace />;
  return children;
}
