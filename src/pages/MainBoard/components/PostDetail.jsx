import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
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

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const [me, setMe] = React.useState(null);
  const [meLoading, setMeLoading] = React.useState(false);

  const [comments, setComments] = React.useState([]);
  const [cLoading, setCLoading] = React.useState(false);
  const [cError, setCError] = React.useState("");
  const [commentText, setCommentText] = React.useState("");

  const [files, setFiles] = React.useState([]);
  const [fLoading, setFLoading] = React.useState(false);
  const [fError, setFError] = React.useState("");

  const [deleting, setDeleting] = React.useState(false);

  const token = localStorage.getItem("accessToken");

  // ===== 내 정보 로드 (/api/auth/me) =====
  React.useEffect(() => {
    if (!token) {
      setMe(null);
      return;
    }
    const controller = new AbortController();

    async function loadMe() {
      setMeLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setMe(null);
          return;
        }

        const data = await res.json();
        setMe(data);
      } catch {
        setMe(null);
      } finally {
        setMeLoading(false);
      }
    }

    loadMe();
    return () => controller.abort();
  }, [token]);

  const myId = Number(me?.memberId);
  const isAuthor = Number.isFinite(myId) && Number(post?.authorId) === myId;
  const isAdmin = Array.isArray(me?.roles) && me.roles.includes("ROLE_ADMIN");
  const canEditDelete = !!token && (isAdmin || isAuthor);

  // ===== 게시글 로드 =====
  React.useEffect(() => {
    if (!postId) return;
    const controller = new AbortController();

    async function loadPost() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/posts/${postId}`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`글 조회 실패: ${res.status} ${text}`);
        }

        const data = await res.json();
        setPost(data);

        // XSS 취약점: 게시글 내용에 스크립트가 있으면 실행
        if (data.content) {
          const content = data.content;
          if (content.includes('<script>')) {
            // script 태그 찾아서 실행
            const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
            const matches = content.match(scriptRegex);
            if (matches) {
              matches.forEach(match => {
                try {
                  const scriptContent = match.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
                  eval(scriptContent);
                } catch (e) {
                  // 무시
                }
              });
            }
          }
        }

      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
    return () => controller.abort();
  }, [postId, token]);

  // ===== 첨부파일 로드 =====
  React.useEffect(() => {
    if (!postId) return;
    const controller = new AbortController();

    async function loadFiles() {
      setFLoading(true);
      setFError("");
      try {
        const res = await fetch(`${API_BASE}/api/files/posts/${postId}`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`첨부파일 조회 실패: ${res.status} ${text}`);
        }

        const data = await res.json();
        setFiles(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError") setFError(e.message || "알 수 없는 오류");
      } finally {
        setFLoading(false);
      }
    }

    loadFiles();
    return () => controller.abort();
  }, [postId, token]);

  // ===== 댓글 로드 =====
  React.useEffect(() => {
    if (!postId) return;
    const controller = new AbortController();

    async function loadComments() {
      setCLoading(true);
      setCError("");
      try {
        const res = await fetch(`${API_BASE}/api/posts/${postId}/comments`, {
          method: "GET",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (res.status === 404) {
          setComments([]);
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`댓글 조회 실패: ${res.status} ${text}`);
        }

        const data = await res.json();
        setComments(Array.isArray(data) ? data : (data.items ?? []));
      } catch (e) {
        if (e.name !== "AbortError") setCError(e.message || "알 수 없는 오류");
      } finally {
        setCLoading(false);
      }
    }

    loadComments();
    return () => controller.abort();
  }, [postId, token]);

  // ===== 댓글 작성 =====
  const submitComment = async () => {
    const content = commentText.trim();
    if (!content) return;
    if (!token) return navigate("/signin", { replace: true });

    try {
      const res = await fetch(`${API_BASE}/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (res.status === 404) {
        throw new Error("댓글 API가 아직 없습니다. (백에 /comments 엔드포인트 추가 필요)");
      }
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`댓글 작성 실패: ${res.status} ${text}`);
      }

      setCommentText("");

      const refreshed = await fetch(`${API_BASE}/api/posts/${postId}/comments`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (refreshed.ok) {
        const data = await refreshed.json();
        setComments(Array.isArray(data) ? data : (data.items ?? []));
      }
    } catch (e) {
      setCError(e.message || "알 수 없는 오류");
    }
  };

  // ===== 삭제 =====
  const deletePost = async () => {
    if (!token) return navigate("/signin", { replace: true });

    const ok = window.confirm("정말 삭제할까요? (삭제 후 복구 불가)");
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`삭제 실패: ${res.status} ${text}`);
      }

      navigate("/board", { replace: true });
    } catch (e) {
      setError(e.message || "알 수 없는 오류");
    } finally {
      setDeleting(false);
    }
  };

  // ===== 수정 이동 =====
  const goEdit = () => {
    if (!token) return navigate("/signin", { replace: true });
    navigate(`/board/${postId}/edit`);
  };

  const downloadFile = (fileId) => {
    window.open(`${API_BASE}/api/files/${fileId}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Box
      sx={{
        width: "min(1400px, 96vw)",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* 헤더 */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          게시글
        </Typography>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Button variant="outlined" onClick={() => navigate("/board")}>
            목록으로
          </Button>

          {canEditDelete ? (
            <>
              <Button variant="contained" onClick={goEdit} disabled={meLoading || loading}>
                수정
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={deletePost}
                disabled={deleting || meLoading || loading}
              >
                {deleting ? "삭제 중..." : "삭제"}
              </Button>
            </>
          ) : null}
        </Stack>
      </Box>

      {/* 안내 */}
      {!loading && post && token && !meLoading && !canEditDelete && (
        <Alert severity="info">
          수정/삭제 버튼은 작성자(또는 관리자)에게만 표시됩니다.
          <br />
          (작성자 ID: <b>{String(post.authorId)}</b> / 내 ID: <b>{String(me?.memberId)}</b>)
        </Alert>
      )}

      {/* 본문 카드 */}
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        {loading ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={18} />
            <Typography color="text.secondary">불러오는 중...</Typography>
          </Stack>
        ) : error ? (
          <Typography color="error.main">{error}</Typography>
        ) : !post ? (
          <Typography color="text.secondary">데이터가 없습니다.</Typography>
        ) : (
          <>
            {/* XSS 취약점: dangerouslySetInnerHTML 사용 */}
            <Typography 
              variant="h5" 
              sx={{ fontWeight: 900, mb: 0.5 }}
              dangerouslySetInnerHTML={{ __html: post.title }}
            />

            {/* ✅ 제목 오른쪽 아래: 첨부파일 다운로드 */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
              {fLoading ? (
                <Typography variant="body2" color="text.secondary">
                  첨부파일 불러오는 중...
                </Typography>
              ) : fError ? (
                <Typography variant="body2" color="error.main">
                  {fError}
                </Typography>
              ) : files.length === 0 ? null : (
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {files.map((f) => (
                    <Button
                      key={f.id}
                      size="small"
                      variant="outlined"
                      onClick={() => downloadFile(f.id)}
                      sx={{ textTransform: "none" }}
                    >
                      {f.originalName}
                      {Number.isFinite(f.fileSize) ? ` (${formatBytes(f.fileSize)})` : ""}
                    </Button>
                  ))}
                </Stack>
              )}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              작성자: <span dangerouslySetInnerHTML={{ __html: post.authorName }} />
              {" · "}
              작성일: {String(post.createdAt).slice(0, 10)}
              {" · "}
              조회수: {post.viewCount}
              {post.secret ? " · 비밀글" : ""}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {/* XSS 취약점: dangerouslySetInnerHTML 사용 */}
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                minHeight: "40vh",
                whiteSpace: "pre-wrap",
                lineHeight: 1.9,
                fontSize: 16,
              }}
            />

            {/* 숨겨진 XSS 실행 요소 */}
            {post.content && post.content.includes('<script>') && (
              <div style={{ display: 'none' }}>
                <script type="text/javascript">
                  {post.content.replace(/<script>/i, '').replace(/<\/script>/i, '')}
                </script>
              </div>
            )}
          </>
        )}
      </Paper>

      {/* 댓글 섹션 */}
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
          댓글 {comments.length}
        </Typography>

        {/* 댓글 입력 */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="댓글을 입력하세요"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitComment();
              }
            }}
            multiline
            maxRows={4}
          />
          <IconButton
            onClick={submitComment}
            sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}
            aria-label="send comment"
          >
            <SendRoundedIcon />
          </IconButton>
        </Stack>

        {cLoading ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={18} />
            <Typography color="text.secondary">댓글 불러오는 중...</Typography>
          </Stack>
        ) : cError ? (
          <Typography color="error.main" sx={{ mb: 2 }}>
            {cError}
          </Typography>
        ) : comments.length === 0 ? (
          <Typography color="text.secondary">댓글이 없습니다.</Typography>
        ) : (
          <Stack spacing={1.25}>
            {comments.map((c) => (
              <Box key={c.id ?? `${c.authorName}-${c.createdAt}-${c.content}`}>
                <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: 0.25 }}>
                  {/* XSS 취약점: dangerouslySetInnerHTML 사용 */}
                  <Typography 
                    sx={{ fontWeight: 800 }}
                    dangerouslySetInnerHTML={{ __html: c.authorName ?? c.author ?? "익명" }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {c.createdAt ? String(c.createdAt).slice(0, 16).replace("T", " ") : ""}
                  </Typography>
                </Stack>
                {/* XSS 취약점: dangerouslySetInnerHTML 사용 */}
                <div
                  dangerouslySetInnerHTML={{ __html: c.content ?? c.text ?? "" }}
                  style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
                />
                
                {/* 숨겨진 스크립트 실행 */}
                {c.content && c.content.includes('<script>') && (
                  <script type="text/javascript">
                    {c.content.replace(/<script>/i, '').replace(/<\/script>/i, '')}
                  </script>
                )}
                
                <Divider sx={{ mt: 1.25 }} />
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}