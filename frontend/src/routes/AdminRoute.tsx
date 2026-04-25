import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { token, isAdmin } = useAuth();
  if (!token) return <Navigate to="/auth/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

export default AdminRoute;
