import * as React from "react";
import { useNavigate } from "react-router-dom";

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

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
}

export default function PostWrite() {
  const navigate = useNavigate();

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [secret, setSecret] = React.useState(false);

  // ✅ 첨부파일
  const [files, setFiles] = React.useState([]); // File[]
  const fileInputRef = React.useRef(null);

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");

  React.useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) navigate("/signin", { replace: true });
  }, [navigate]);

  const onPickFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;

    // 동일 파일 중복 방지(이름+사이즈 기반)
    setFiles((prev) => {
      const map = new Map(prev.map((f) => [`${f.name}:${f.size}`, f]));
      picked.forEach((f) => map.set(`${f.name}:${f.size}`, f));
      return Array.from(map.values());
    });

    // 같은 파일 다시 선택 가능하게 input reset
    e.target.value = "";
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadOne = async (postId, file, token) => {
    const fd = new FormData();
    fd.append("file", file); // ✅ FileController가 @RequestParam("file") 로 받음

    const res = await fetch(`${API_BASE}/api/files/posts/${postId}`, {
      method: "POST",
      headers: {
        // FormData는 Content-Type 지정하면 안 됨 (브라우저가 boundary 붙임)
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`파일 업로드 실패: ${res.status} ${text}`);
    }

    // 백이 Long(fileId) 반환
    const raw = await res.text();
    const fileId = Number(raw);
    return Number.isFinite(fileId) ? fileId : null;
  };

  const onSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return navigate("/signin", { replace: true });

    const t = title.trim();
    const c = content.trim();
    if (!t) return setError("제목을 입력하세요.");
    if (!c) return setError("내용을 입력하세요.");

    setSubmitting(true);
    setError("");
    setNotice("");

    let postId = null;

    try {
      // 1) 글 생성
      const res = await fetch(`${API_BASE}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: t, content: c, secret }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`글쓰기 실패: ${res.status} ${text}`);
      }

      const raw = await res.text();
      const idNum = Number(raw);
      if (Number.isFinite(idNum)) {
        postId = idNum;
      } else {
        try {
          const obj = JSON.parse(raw);
          const id2 = Number(obj?.id);
          if (Number.isFinite(id2)) postId = id2;
        } catch {
          // ignore
        }
      }

      if (!Number.isFinite(postId)) {
        // 글 id를 못 받으면 파일 업로드 못 함
        navigate("/board");
        return;
      }

      // 2) 첨부파일 업로드(선택)
      if (files.length > 0) {
        const failed = [];
        for (const f of files) {
          try {
            await uploadOne(postId, f, token);
          } catch (e) {
            failed.push({ name: f.name, msg: e?.message || "업로드 실패" });
          }
        }

        if (failed.length > 0) {
          setNotice(
            `글은 등록됐지만 일부 파일 업로드가 실패했습니다:\n` +
              failed.map((x) => `- ${x.name}`).join("\n")
          );
        }
      }

      // 3) 상세로 이동
      navigate(`/board/${postId}`, { replace: true });
    } catch (e) {
      setError(e?.message || "알 수 없는 오류");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        width: "min(1000px, 96vw)",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          글쓰기
        </Typography>
        <Button variant="outlined" onClick={() => navigate("/board")}>
          목록으로
        </Button>
      </Box>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {notice ? (
        <Alert severity="warning" sx={{ whiteSpace: "pre-wrap" }}>
          {notice}
        </Alert>
      ) : null}

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            fullWidth
            disabled={submitting}
          />

          <Divider />

          <TextField
            label="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            fullWidth
            multiline
            minRows={10}
            disabled={submitting}
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

          {/* ✅ 첨부파일 UI */}
          <Divider />

          <Stack spacing={1}>
            <Typography sx={{ fontWeight: 900 }}>첨부파일</Typography>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={onPickFiles}
              />
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                disabled={submitting}
              >
                파일 선택
              </Button>

              {files.length > 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {files.length}개 선택됨
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  선택한 파일이 없습니다.
                </Typography>
              )}
            </Stack>

            {files.length > 0 ? (
              <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 2 }}>
                <Stack spacing={1}>
                  {files.map((f, idx) => (
                    <Stack
                      key={`${f.name}:${f.size}:${idx}`}
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ justifyContent: "space-between", gap: 1 }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 700 }} noWrap title={f.name}>
                          {f.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatBytes(f.size)} {f.type ? `· ${f.type}` : ""}
                        </Typography>
                      </Box>

                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        onClick={() => removeFile(idx)}
                        disabled={submitting}
                      >
                        제거
                      </Button>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            ) : null}
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pt: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={secret}
                  onChange={(e) => setSecret(e.target.checked)}
                  disabled={submitting}
                />
              }
              label="비밀글"
            />

            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => navigate("/board")} disabled={submitting}>
                취소
              </Button>
              <Button variant="contained" onClick={onSubmit} disabled={submitting}>
                {submitting ? "등록 중..." : "등록"}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
