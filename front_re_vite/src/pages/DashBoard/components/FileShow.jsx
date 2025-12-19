import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

import { getAdminFile } from '@/api/admin/fileapi';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export default function FileShow() {
  const { fileId } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = React.useState(false);
  const [file, setFile] = React.useState(null);

  React.useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const res = await getAdminFile(fileId);
        if (!ignore) setFile(res.data);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [fileId]);

  if (loading || !file) {
    return (
      <Box sx={{ p: 3, display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const downloadUrl = `${API_BASE}/api/files/${file.id}`;

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>첨부파일 상세</Typography>
          <Typography variant="body2" color="text.secondary">ID: {file.id}</Typography>
        </Box>

        <Button variant="outlined" onClick={() => nav('/admin/files')}>목록</Button>
        <Button variant="outlined" onClick={() => nav(`/admin/files/${file.id}/edit`)}>수정</Button>
        <Button variant="contained" onClick={() => nav('/board')}>게시판</Button>
      </Stack>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Typography sx={{ fontWeight: 800 }}>파일명</Typography>
          <Typography>{file.originalName}</Typography>
          <Divider />

          <Typography sx={{ fontWeight: 800 }}>저장명</Typography>
          <Typography>{file.storedName ?? '-'}</Typography>
          <Divider />

          <Typography sx={{ fontWeight: 800 }}>Content-Type</Typography>
          <Typography>{file.contentType ?? '-'}</Typography>
          <Divider />

          <Typography sx={{ fontWeight: 800 }}>크기</Typography>
          <Typography>{(file.size ?? 0).toLocaleString()} B</Typography>
          <Divider />

          <Typography sx={{ fontWeight: 800 }}>업로더</Typography>
          <Typography>{file.uploaderUsername ?? '-'}</Typography>
          <Divider />

          <Typography sx={{ fontWeight: 800 }}>게시글</Typography>
          <Typography>{file.postId ?? '-'}</Typography>
          <Divider />

          <Typography sx={{ fontWeight: 800 }}>상태</Typography>
          <Typography>{file.deleted ? '삭제됨' : '정상'}</Typography>

          <Divider />

          <Button variant="outlined" onClick={() => window.open(downloadUrl, '_blank', 'noopener,noreferrer')}>
            다운로드
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
