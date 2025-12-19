import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { getAdminFile, updateAdminFile } from '@/api/admin/fileapi';

export default function FileEdit() {
  const { fileId } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  const [form, setForm] = React.useState({ originalName: '' });

  React.useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getAdminFile(fileId);
        if (ignore) return;
        setForm({ originalName: res.data?.originalName ?? '' });
      } catch (e) {
        if (!ignore) setError('첨부파일 정보를 불러오지 못했습니다.');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [fileId]);

  const onSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateAdminFile(fileId, form);
      nav(`/admin/files/${fileId}`, { replace: true });
    } catch (e) {
      setError(e?.response?.data?.message ?? '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>첨부파일 수정</Typography>
          <Typography variant="body2" color="text.secondary">ID: {fileId}</Typography>
        </Box>

        <Button variant="outlined" onClick={() => nav('/admin/files')}>목록</Button>
        <Button variant="contained" onClick={() => nav('/board')}>게시판</Button>
      </Stack>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={2} maxWidth={520}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="표시 파일명(원본명)"
            value={form.originalName}
            onChange={(e) => setForm((p) => ({ ...p, originalName: e.target.value }))}
            fullWidth
          />

          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={onSave} disabled={saving}>
              저장
            </Button>
            <Button variant="outlined" onClick={() => nav(-1)} disabled={saving}>
              취소
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
