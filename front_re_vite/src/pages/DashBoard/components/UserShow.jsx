import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router-dom';
import { getAdminUser } from '../../../api/admin/userapi'; // 경로는 네 폴더 기준으로 맞춰

export default function UserShow() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getAdminUser(userId);
        if (mounted) setUser(res.data);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e?.message || '사용자 조회 실패');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [userId]);

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            사용자 상세
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {userId}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => navigate('/admin/users')}>
            목록
          </Button>
          <Button variant="contained" disabled={!user} onClick={() => navigate(`/admin/users/${userId}/edit`)}>
            수정
          </Button>
        </Stack>
      </Stack>

      {loading && (
        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} />
          <Typography variant="body2">불러오는 중...</Typography>
        </Paper>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && user && (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography sx={{ fontWeight: 700 }}>기본 정보</Typography>
          <Divider sx={{ my: 1.5 }} />
          <Stack spacing={1}>
            <Typography>username: {user.username}</Typography>
            <Typography>name: {user.name}</Typography>
            <Typography>email: {user.email}</Typography>
            <Typography>role: {user.role}</Typography>
            <Typography>deleted: {String(user.deleted)}</Typography>
            <Typography>createdAt: {user.createdAt}</Typography>
            <Typography>updatedAt: {user.updatedAt ?? '-'}</Typography>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
