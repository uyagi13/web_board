import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function getMyIdFromToken(token) {
  if (!token) return null;
  try {
    const payload = jwtDecode(token);
    const raw = payload.memberId ?? payload.userId ?? payload.id ?? payload.sub;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function getRolesFromToken(token) {
  if (!token) return [];
  try {
    const payload = jwtDecode(token);
    const roles = payload.roles ?? payload.authorities ?? payload.role ?? [];
    if (Array.isArray(roles)) return roles.map(String);
    if (typeof roles === "string") return [roles];
    return [];
  } catch {
    return [];
  }
}

export default function PostEdit() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  const myId = getMyIdFromToken(token);
  const rolesFromToken = getRolesFromToken(token);
  const isAdmin = rolesFromToken.includes("ROLE_ADMIN");

  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");

  const [post, setPost] = React.useState(null);

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [secret, setSecret] = React.useState(false);

  // 로그인 없으면 로그인으로
  React.useEffect(() => {
    if (!token) navigate("/signin", { replace: true });
  }, [token, navigate]);

  // 기존 글 로드
  React.useEffect(() => {
    if (!postId) return;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/posts/${postId}`, {
          method: "GET",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`글 조회 실패: ${res.status} ${text}`);
        }

        const data = await res.json();
        setPost(data);

        // ✅ 폼 채우기 (필드명은 DTO에 맞춰 수정 가능)
        setTitle(data.title ?? "");
        setContent(data.content ?? "");
        setSecret(Boolean(data.secret));
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [postId]);

  const canEdit = !!token && (isAdmin || (myId != null && Number(post?.authorId) === myId));

  // 저장
  const onSave = async () => {
    if (!token) return navigate("/signin", { replace: true });
    if (!canEdit) return setError("수정 권한이 없습니다.");

    const t = title.trim();
    const c = content.trim();
    if (!t) return setError("제목을 입력하세요.");
    if (!c) return setError("내용을 입력하세요.");

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: t,
          content: c,
          secret,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`수정 실패: ${res.status} ${text}`);
      }

      navigate(`/board/${postId}`);
    } catch (e) {
      setError(e?.message || "알 수 없는 오류");
    } finally {
      setSaving(false);
    }
  };

  if (!token) return null; // 로그인 리다이렉트 중

  return (
    <Box
      sx={{
        width: "min(1100px, 94vw)",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          게시글 수정
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => navigate(`/board/${postId}`)} disabled={saving}>
            취소
          </Button>
          <Button variant="contained" onClick={onSave} disabled={saving || loading}>
            {saving ? "저장 중..." : "저장"}
          </Button>
        </Stack>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {loading ? (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={18} />
            <Typography color="text.secondary">불러오는 중...</Typography>
          </Stack>
        </Paper>
      ) : !post ? (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Typography color="text.secondary">게시글이 없습니다.</Typography>
        </Paper>
      ) : !canEdit ? (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Alert severity="warning">
            이 글을 수정할 권한이 없습니다.
            <br />
            (작성자 ID: {String(post.authorId)} / 내 ID: {String(myId)})
          </Alert>
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate(`/board/${postId}`)}>
              상세로 돌아가기
            </Button>
          </Box>
        </Paper>
      ) : (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              disabled={saving}
            />

            <Divider />

            <TextField
              label="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              fullWidth
              multiline
              minRows={20}
              disabled={saving}
              InputProps={{
                sx: {
                  minHeight: "65vh",
                  alignItems: "flex-start",
                },
              }}
              sx={{
                "& .MuiInputBase-inputMultiline": {
                  minHeight: "60vh !important",
                },
              }}
            />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <FormControlLabel
                control={
                  <Switch checked={secret} onChange={(e) => setSecret(e.target.checked)} disabled={saving} />
                }
                label="비밀글"
              />

              <Typography variant="caption" color="text.secondary">
                저장하면 바로 상세로 이동합니다.
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
