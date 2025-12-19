import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { getAdminSummary } from '@/api/admin/adminapi';

export default function AdminHome() {
  const [summary, setSummary] = React.useState({
    userCount: 0,
    postCount: 0,
  });

  React.useEffect(() => {
    getAdminSummary().then((res) => {
      setSummary(res.data);
    });
  }, []);

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 900 }}>
        관리자 대시보드
      </Typography>
      <Typography variant="body2" color="text.secondary">
        사용자 / 게시글 현황 요약
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography sx={{ fontWeight: 700 }}>사용자</Typography>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 900 }}>
            {summary.userCount}
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography sx={{ fontWeight: 700 }}>게시글</Typography>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 900 }}>
            {summary.postCount}
          </Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
          <Typography sx={{ fontWeight: 700 }}>첨부파일</Typography>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 900 }}>
            {summary.fileCount}
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );
}
