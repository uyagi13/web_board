import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function getRoleFromToken() {
  const token = localStorage.getItem("accessToken"); 
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const role =
      payload.role;

    return role; 
  } catch {
    return null;
  }
}

export default function ProtectedAdminRoute() {
  const token = localStorage.getItem("accessToken");
  const role = getRoleFromToken();

  const isAdmin = role === "ROLE_ADMIN" || role === "ADMIN";
  if (!token) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />; // 혹은 403 페이지로
  return <Outlet />;
}
