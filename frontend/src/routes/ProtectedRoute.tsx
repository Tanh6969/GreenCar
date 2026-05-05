import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  return children;
};

export default ProtectedRoute;
