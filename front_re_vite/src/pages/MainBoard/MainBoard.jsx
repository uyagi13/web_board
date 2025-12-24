import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";

import AppTheme from "../../shared-theme/AppTheme";
import AppAppBar from "./components/AppAppBar";
import BoardList from "./components/BoardList";
import PostDetail from "./components/PostDetail";
import PostWrite from "./components/PostWrite";
import PostEdit from "./components/PostEdit";

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

          <Route index element={<BoardList />} />

          <Route path="write" element={<PostWrite />} />
          <Route path=":postId/edit" element={<PostEdit />} />


          <Route path=":postId" element={<PostDetail />} />

          <Route path="*" element={<Navigate to="/board" replace />} />
        </Routes>
      </Container>

    </AppTheme>
  );
}
