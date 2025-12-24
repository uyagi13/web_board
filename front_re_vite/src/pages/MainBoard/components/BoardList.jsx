import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useNavigate } from "react-router-dom";


const API_BASE =
  import.meta.env.VITE_API_BASE ||
  window.location.origin;
  
export default function BoardList() {
  const [q, setQ] = React.useState('');
  const [page, setPage] = React.useState(1); // UI는 1-base

  const [rows, setRows] = React.useState([]);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // 간단 디바운스(검색 타이핑마다 호출 폭주 방지)
  const [debouncedQ, setDebouncedQ] = React.useState(q);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  React.useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (debouncedQ.trim()) params.set('keyword', debouncedQ.trim());
        params.set('page', String(page - 1)); // ✅ 백은 0-base
        params.set('size', '10');

       const res = await fetch(`${API_BASE}/api/posts?${params.toString()}`, {
        method: 'GET',
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });


        if (!res.ok) {
          const text = await res.text();
          throw new Error(`게시글 조회 실패: ${res.status} ${text}`);
        }

        const data = await res.json();
        setRows(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message || '알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [page, debouncedQ]);

    const navigate = useNavigate();

    const onClickRow = (postId) => {
      navigate(`/board/${postId}`);
    };


  const onClickWrite = () => {
      navigate('/board/write')
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>게시판</Typography>
          <Typography variant="body2" color="text.secondary">
            자유게시판입니다
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<EditRoundedIcon />} onClick={onClickWrite} sx={{ height: 40 }}>
          글쓰기
        </Button>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
  
    

        <FormControl sx={{ width: { xs: '100%', sm: '320px' } }} variant="outlined">
          <OutlinedInput
            size="small"
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }} // ✅ 검색하면 1페이지로
            placeholder="제목/작성자/번호 검색"
            startAdornment={
              <InputAdornment position="start" sx={{ color: 'text.primary' }}>
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            }
          />
        </FormControl>
      </Stack>

      <Divider />

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 90, fontWeight: 700 }}>번호</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>제목</TableCell>
              <TableCell sx={{ width: 140, fontWeight: 700 }}>작성자</TableCell>
              <TableCell sx={{ width: 140, fontWeight: 700 }}>작성일</TableCell>
              <TableCell sx={{ width: 90, fontWeight: 700 }} align="right">조회</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                  불러오는 중...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 6, textAlign: 'center', color: 'error.main' }}>
                  {error}
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((p) => (
                <TableRow key={p.id} hover onClick={() => onClickRow(p.id)} sx={{ cursor: 'pointer' }}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{p.title}</TableCell>
                  <TableCell>{p.authorName }</TableCell>
                  <TableCell>{String(p.createdAt).slice(0, 10)}</TableCell>
                  <TableCell align="right">{p.viewCount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, v) => setPage(v)}
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
}
