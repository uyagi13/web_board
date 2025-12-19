import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

import AppTheme from "../../shared-theme/AppTheme";
import AppAppBar from "./components/AppAppBar";
import BoardList from "./components/BoardList";
import PostDetail from "./components/PostDetail";
import PostWrite from "./components/PostWrite"; // ✅ 추가
import PostEdit from "./components/PostEdit";

import Footer from "./components/Footer";

export default function MainBoard(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />

      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: "flex", flexDirection: "column", my: 16, gap: 3 }}
      >
        <Routes>
          {/* /board */}
          <Route index element={<BoardList />} />

          {/* /board/write  (✅ 이게 postId보다 위에 있어야 안전) */}
          <Route path="write" element={<PostWrite />} />
          <Route path=":postId/edit" element={<PostEdit />} />

          {/* /board/:postId */}
          <Route path=":postId" element={<PostDetail />} />

          {/* 나머지 */}
          <Route path="*" element={<Navigate to="/board" replace />} />
        </Routes>
      </Container>

      <Footer />
    </AppTheme>
  );
}
