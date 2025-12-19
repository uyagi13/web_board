import CssBaseline from "@mui/material/CssBaseline";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import AdminLayout from "./components/AdminLayout";
import AdminHome from "./components/AdminHome";

import UserList from "./components/UserList";
import UserShow from "./components/UserShow";
import UserCreate from "./components/UserCreate";
import UserEdit from "./components/UserEdit";

import PostList from "./components/PostList";
import PostShow from "./components/PostShow";
import PostEdit from "./components/PostEdit";

import FileList from "./components/FileList";
import FileShow from "./components/FileShow";
import FileEdit from "./components/FileEdit";

import NotificationsProvider from "./hooks/useNotifications/NotificationsProvider";
import DialogsProvider from "./hooks/useDialogs/DialogsProvider";
import AppTheme from "../../shared-theme/AppTheme";

import {
  dataGridCustomizations,
  datePickersCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from "./theme/customizations";

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

// ✅ /admin 라우트 가드 (로그인 + ADMIN만 접근)
function getRoleFromToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // 프로젝트마다 클레임명이 다를 수 있어서 폭넓게 대응
    const role =
      payload.role ||
      (Array.isArray(payload.roles) ? payload.roles[0] : null) ||
      (Array.isArray(payload.authorities) ? payload.authorities[0] : null);

    return role; // "ROLE_ADMIN" 또는 "ADMIN" 형태일 수 있음
  } catch {
    return null;
  }
}

function ProtectedAdminRoute() {
  // 너 프로젝트 저장 키에 맞춰 변경 가능
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("token");

  const role = getRoleFromToken(token);
  const isAdmin = role === "ROLE_ADMIN" || role === "ADMIN";

  if (!token) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}

export default function AdminDashboard(props) {
  return (
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <Routes>
            {/* ✅ /admin 이하 전부 보호 */}
            <Route element={<ProtectedAdminRoute />}>
              <Route element={<AdminLayout />}>
                {/* ✅ /admin 진입 시 대시보드로 */}
                <Route index element={<Navigate to="dashboard" replace />} />

                {/* ✅ 대시보드 */}
                <Route path="dashboard" element={<AdminHome />} />

                {/* 사용자 관리 */}
                <Route path="users">
                  <Route index element={<UserList />} />
                  <Route path="new" element={<UserCreate />} />
                  <Route path=":userId" element={<UserShow />} />
                  <Route path=":userId/edit" element={<UserEdit />} />
                </Route>

                {/* 게시글 관리 */}
                <Route path="posts">
                  <Route index element={<PostList />} />
                  <Route path=":postId" element={<PostShow />} />
                  <Route path=":postId/edit" element={<PostEdit />} />
                </Route>

                <Route path="files">
                  <Route index element={<FileList />} />
                  <Route path=":fileId" element={<FileShow />} />
                  <Route path=":fileId/edit" element={<FileEdit />} />
                </Route>


                {/* fallback */}
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Route>
            </Route>
          </Routes>
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}
