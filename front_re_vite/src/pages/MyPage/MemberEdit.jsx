import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  Divider,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export default function MemberEdit() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [me, setMe] = React.useState(null);
  const [error, setError] = React.useState("");

  // 이메일 수정
  const [editingEmail, setEditingEmail] = React.useState(false);
  const [email, setEmail] = React.useState("");

  // 비밀번호 수정
  const [editingPw, setEditingPw] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [password2, setPassword2] = React.useState("");

  React.useEffect(() => {
    async function loadMe() {
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setError("회원 정보를 불러오지 못했습니다. 다시 로그인해 주세요.");
          return;
        }

        const data = await res.json();
        setMe(data);
        setEmail(data.email ?? "");
      } catch {
        setError("회원 정보를 불러오지 못했습니다.");
      }
    }
    loadMe();
  }, [token]);

  /* ---------------- 이메일 저장 ---------------- */
  const saveEmail = async () => {
    setError("");
    if (!email || !email.includes("@")) {
      setError("이메일 형식을 확인해 주세요.");
      return;
    }

    try {
      await axios.put(
        `${API_BASE}/api/member/me`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingEmail(false);
      setMe((prev) => ({ ...prev, email }));

      // ✅ 저장 성공 → 게시판 이동
      navigate("/board", { replace: true });
    } catch (e) {
      console.log(e?.response?.status, e?.response?.data);
      setError(
        e?.response?.data?.message ||
          "이메일 수정에 실패했습니다."
      );
    }
  };

  /* ---------------- 비밀번호 저장 ---------------- */
  const savePassword = async () => {
    setError("");

    if (!password || password.length < 4) {
      setError("비밀번호는 최소 4자 이상이어야 합니다.");
      return;
    }
    if (password !== password2) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      await axios.put(
        `${API_BASE}/api/member/me`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingPw(false);
      setPassword("");
      setPassword2("");

      // ✅ 저장 성공 → 게시판 이동
      navigate("/board", { replace: true });
    } catch (e) {
      console.log(e?.response?.status, e?.response?.data);
      setError(
        e?.response?.data?.message ||
          "비밀번호 수정에 실패했습니다."
      );
    }
  };

  if (!me) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        {error ? <Alert severity="error">{error}</Alert> : null}
      </Box>
    );
  }

  const roleText = Array.isArray(me.roles)
    ? me.roles.join(", ")
    : me.role ?? "";

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 10, px: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 520 }}>
        <CardContent>
          <Stack spacing={2.5}>
            <Typography variant="h5" fontWeight={800}>
              회원정보 수정
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            {/* ================= 기본 정보 ================= */}
            <Stack spacing={2}>
              <TextField
                label="아이디"
                value={me.username}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{
                  pointerEvents: "none",
                  "& .MuiInputBase-input": {
                    color: "black",
                    fontWeight: 700,
                    userSelect: "none",
                  },
                }}
              />

              <TextField
                label="권한"
                value={roleText}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{
                  pointerEvents: "none",
                  "& .MuiInputBase-input": {
                    color: "black",
                    fontWeight: 700,
                    userSelect: "none",
                  },
                }}
              />
            </Stack>

            <Divider />

            {/* ================= 이메일 ================= */}
            {!editingEmail ? (
              <>
                <TextField
                  label="이메일"
                  value={me.email ?? ""}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                <Button onClick={() => setEditingEmail(true)}>
                  이메일 수정
                </Button>
              </>
            ) : (
              <>
                <TextField
                  label="새 이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button onClick={() => setEditingEmail(false)}>
                    취소
                  </Button>
                  <Button variant="contained" onClick={saveEmail}>
                    저장
                  </Button>
                </Stack>
              </>
            )}

            <Divider />

            {/* ================= 비밀번호 ================= */}
            {!editingPw ? (
              <>
                <TextField
                  label="비밀번호"
                  value="********"
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                <Button onClick={() => setEditingPw(true)}>
                  비밀번호 수정
                </Button>
              </>
            ) : (
              <>
                <TextField
                  label="새 비밀번호"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="새 비밀번호 확인"
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  fullWidth
                />
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button onClick={() => setEditingPw(false)}>
                    취소
                  </Button>
                  <Button variant="contained" onClick={savePassword}>
                    저장
                  </Button>
                </Stack>
              </>
            )}

            <Divider />

            {/* ================= 하단 공통 버튼 ================= */}
            {/* ✅ 언제든 게시판으로 이동 */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/board")}
              >
                게시판으로 이동
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
