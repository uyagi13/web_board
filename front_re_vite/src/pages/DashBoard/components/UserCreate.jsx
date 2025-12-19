import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';

export default function UserCreate() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    username: '',
    name: '',
    email: '',
    role: 'USER',
  });

  const onChange = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: API POST /admin/users
    console.log('create user:', form);
    navigate('/admin/users');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper variant="outlined" sx={{ p: 2, maxWidth: 720 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          사용자 등록
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          관리자 권한에서 신규 사용자를 생성합니다.
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
              <Button variant="outlined" onClick={() => navigate('/admin/users')}>
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
