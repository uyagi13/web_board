import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, useParams } from 'react-router-dom';

export default function UserEdit() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // TODO: API GET /admin/users/:id 로 초기값 세팅
  const [form, setForm] = React.useState({
    username: 'sample',
    name: '샘플 사용자',
    email: 'sample@example.com',
    role: 'USER',
  });

  const onChange = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: API PUT/PATCH /admin/users/:id
    console.log('update user:', userId, form);
    navigate(`/admin/users/${userId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper variant="outlined" sx={{ p: 2, maxWidth: 720 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          사용자 수정
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          ID: {userId}
        </Typography>

        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField label="아이디(username)" value={form.username} onChange={onChange('username')} required />
            <TextField label="이름(name)" value={form.name} onChange={onChange('name')} required />
            <TextField label="이메일(email)" value={form.email} onChange={onChange('email')} required />
            <TextField select label="권한(role)" value={form.role} onChange={onChange('role')}>
              <MenuItem value="USER">USER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </TextField>

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate(`/admin/users/${userId}`)}>
                취소
              </Button>
              <Button type="submit" variant="contained">
                저장
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
