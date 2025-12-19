import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function getRoleFromToken() {
  const token = localStorage.getItem("accessToken"); // 너 프로젝트 저장 방식에 맞게 변경
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // 보통 role/roles/authorities 중 하나로 들어있음. 너 백엔드 JWT 클레임명에 맞춰 수정
    const role =
      payload.role ||
      (Array.isArray(payload.roles) ? payload.roles[0] : null) ||
      (Array.isArray(payload.authorities) ? payload.authorities[0] : null);

    return role; // 예: "ROLE_ADMIN" or "ADMIN"
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
