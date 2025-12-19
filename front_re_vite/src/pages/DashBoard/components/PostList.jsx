import * as React from 'react';
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

import {
  getAdminPosts,
  deleteAdminPost,
  restoreAdminPost,
} from '@/api/admin/postapi';

export default function PostList() {
  const [loading, setLoading] = React.useState(false);

  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [size] = React.useState(20);
  const [totalPages, setTotalPages] = React.useState(0);

  // ✅ 삭제 포함 토글
  const [includeDeleted, setIncludeDeleted] = React.useState(false);

  const fetchPosts = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminPosts({ page, size, includeDeleted });
      setRows(res.data?.content ?? []);
      setTotalPages(res.data?.totalPages ?? 0);
    } catch (e) {
      console.log("admin posts error", e?.response?.status, e?.response?.data);
    } finally {
      setLoading(false);
    }
  }, [page, size, includeDeleted]);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (postId) => {
    await deleteAdminPost(postId);
    fetchPosts();
  };

  const handleRestore = async (postId) => {
    await restoreAdminPost(postId);
    fetchPosts();
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
        <Box sx={{ flex: 1, width: '100%' }}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            게시글 관리
          </Typography>
          <Typography variant="body2" color="text.secondary">
            게시글 목록 조회 / 삭제 / 복구
          </Typography>
        </Box>

        {/* ✅ 삭제 포함 토글 */}
        <FormControlLabel
          control={
            <Switch
              checked={includeDeleted}
              onChange={(e) => {
                setPage(0);
                setIncludeDeleted(e.target.checked);
              }}
            />
          }
          label="삭제된 게시글 포함"
        />

        <Button variant="outlined" onClick={fetchPosts} disabled={loading}>
          새로고침
        </Button>
      </Stack>

      <Paper variant="outlined">
        {loading ? (
          <Box sx={{ py: 6, display: 'grid', placeItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, width: 90 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>제목</TableCell>
                <TableCell sx={{ fontWeight: 800, width: 140 }}>작성자</TableCell>
                <TableCell sx={{ fontWeight: 800, width: 160 }}>작성일</TableCell>
                <TableCell sx={{ fontWeight: 800, width: 220 }}>작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((p) => {
                const isDeleted = !!p.deleted; // ✅ DTO에 deleted 포함되어 있어야 함
                return (
                  <TableRow
                    key={p.postId}
                    hover
                    sx={{
                      opacity: isDeleted ? 0.55 : 1,
                    }}
                  >
                    <TableCell>{p.postId}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {p.title ?? '(제목 없음)'}
                      {isDeleted ? ' (삭제됨)' : ''}
                    </TableCell>
                    <TableCell>{p.writer ?? p.authorUsername ?? '-'}</TableCell>
                    <TableCell>{p.createdAt ?? '-'}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {!isDeleted ? (
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(p.postId)}
                          >
                            삭제
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() => handleRestore(p.postId)}
                          >
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
                  <TableCell colSpan={5} sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                    게시글이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(_, v) => setPage(v - 1)}
          boundaryCount={2}
          siblingCount={1}
        />
      </Box>
    </Box>
  );
}
