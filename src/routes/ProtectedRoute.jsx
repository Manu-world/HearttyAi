// ProtectedRoute.js
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../provider/useAuth";

const ProtectedRoute = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
