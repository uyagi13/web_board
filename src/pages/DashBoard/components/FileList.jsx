import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import { getAdminFiles, deleteAdminFile, restoreAdminFile } from '@/api/admin/fileapi';

export default function FileList() {
  const nav = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [size] = React.useState(20);
  const [totalPages, setTotalPages] = React.useState(0);

  const [includeDeleted, setIncludeDeleted] = React.useState(false);

  const fetchFiles = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminFiles({ page, size, includeDeleted });
      setRows(res.data?.content ?? []);
      setTotalPages(res.data?.totalPages ?? 0);
    } finally {
      setLoading(false);
    }
  }, [page, size, includeDeleted]);

  React.useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const onDelete = async (id) => {
    await deleteAdminFile(id);
    fetchFiles();
  };
  const onRestore = async (id) => {
    await restoreAdminFile(id);
    fetchFiles();
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
        <Box sx={{ flex: 1, width: '100%' }}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>첨부파일 관리</Typography>
          <Typography variant="body2" color="text.secondary">
            첨부파일 목록 조회 / 삭제 / 복구 / 상세 / 수정
          </Typography>
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={includeDeleted}
              onChange={(e) => { setPage(0); setIncludeDeleted(e.target.checked); }}
            />
          }
          label="삭제 포함"
        />

        <Button variant="outlined" onClick={fetchFiles} disabled={loading}>새로고침</Button>
      </Stack>

      <Paper variant="outlined">
        {loading ? (
          <Box sx={{ py: 6, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, width: 90 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>파일명</TableCell>
                <TableCell sx={{ fontWeight: 800, width: 140 }}>업로더</TableCell>
                <TableCell sx={{ fontWeight: 800, width: 140 }}>크기</TableCell>
                <TableCell sx={{ fontWeight: 800, width: 120 }}>게시글</TableCell>
                <TableCell sx={{ fontWeight: 800, width: 240 }}>작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((f) => {
                const isDeleted = !!f.deleted;
                return (
                  <TableRow key={f.id} hover sx={{ opacity: isDeleted ? 0.55 : 1 }}>
                    <TableCell>{f.id}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {f.originalName ?? '-'}{isDeleted ? ' (삭제됨)' : ''}
                    </TableCell>
                    <TableCell>{f.uploaderUsername ?? '-'}</TableCell>
                    <TableCell>{(f.size ?? 0).toLocaleString()} B</TableCell>
                    <TableCell>{f.postId ?? '-'}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="outlined" onClick={() => nav(`/admin/files/${f.id}`)}>
                          상세
                        </Button>
                        <Button size="small" variant="outlined" onClick={() => nav(`/admin/files/${f.id}/edit`)}>
                          수정
                        </Button>
                        {!isDeleted ? (
                          <Button size="small" variant="contained" color="error" onClick={() => onDelete(f.id)}>
                            삭제
                          </Button>
                        ) : (
                          <Button size="small" variant="outlined" color="success" onClick={() => onRestore(f.id)}>
                            복구
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}

              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                    첨부파일이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
        <Pagination count={totalPages} page={page + 1} onChange={(_, v) => setPage(v - 1)} />
      </Box>
    </Box>
  );
}
