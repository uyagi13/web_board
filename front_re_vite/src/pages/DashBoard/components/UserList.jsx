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
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import {
  getAdminUsers,
  changeAdminUserRole,
  deleteAdminUser,
  restoreAdminUser,
} from '@/api/admin/userapi';

export default function UserList() {
  const [loading, setLoading] = React.useState(false);

  // Spring Page
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0); // 백엔드: 0부터
  const [size] = React.useState(20);
  const [totalPages, setTotalPages] = React.useState(0);

  const [includeDeleted, setIncludeDeleted] = React.useState(false);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers({ includeDeleted, page, size });

      setRows(res.data?.content ?? []);
      setTotalPages(res.data?.totalPages ?? 0);
    } finally {
      setLoading(false);
    }
  }, [includeDeleted, page, size]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onChangeRole = async (memberId, role) => {
    await changeAdminUserRole(memberId, role);
    fetchUsers();
  };

  const onDelete = async (memberId) => {
    await deleteAdminUser(memberId);
    fetchUsers();
  };

  const onRestore = async (memberId) => {
    await restoreAdminUser(memberId);
    fetchUsers();
  };

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* ✅ PostList처럼 상단 헤더 추가 */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
        <Box sx={{ flex: 1, width: '100%' }}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            사용자 관리
          </Typography>
          <Typography variant="body2" color="text.secondary">
            사용자 목록 조회 / 권한 변경 / 삭제 / 복구
          </Typography>
        </Box>

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
          label="삭제 사용자 포함"
        />

        <Button variant="outlined" onClick={fetchUsers} disabled={loading}>
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
                <TableCell sx={{ fontWeight: 800 }}>username</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>name</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>email</TableCell>
                <TableCell sx={{ fontWeight: 800, width: 140 }}>role</TableCell>
                <TableCell sx={{ fontWeight: 800, width: 260 }}>작업</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((u) => {
                const isDeleted = !!u.deleted; // AdminMemberDto에 deleted 있어야 함
                return (
                  <TableRow
                    key={u.id}
                    hover
                    sx={{ opacity: isDeleted ? 0.55 : 1 }}
                  >
                    <TableCell>{u.id}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {u.username ?? '-'}
                    </TableCell>
                    <TableCell>{u.name ?? '-'}</TableCell>
                    <TableCell>{u.email ?? '-'}</TableCell>

                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={u.role ?? 'USER'}
                          onChange={(e) => onChangeRole(u.id, e.target.value)}
                          disabled={isDeleted}
                        >
                          <MenuItem value="USER">USER</MenuItem>
                          <MenuItem value="ADMIN">ADMIN</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {!isDeleted ? (
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() => onDelete(u.id)}
                          >
                            삭제
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() => onRestore(u.id)}
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
                  <TableCell
                    colSpan={6}
                    sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}
                  >
                    사용자가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* ✅ pagination */}
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
