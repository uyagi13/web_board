import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router-dom';
import { getAdminPost } from '../../../api/admin/postapi'; // 경로 맞춰

export default function PostShow() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getAdminPost(postId);
        if (mounted) setPost(res.data);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e?.message || '게시글 조회 실패');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [postId]);

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            게시글 상세
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {postId}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => navigate('/admin/posts')}>
            목록
          </Button>
          <Button variant="contained" disabled={!post} onClick={() => navigate(`/admin/posts/${postId}/edit`)}>
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

      {!loading && !error && post && (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {post.title}
            </Typography>
            <Chip size="small" label={post.deleted ? 'DELETED' : 'ACTIVE'} />
            {post.secret && <Chip size="small" label="SECRET" />}
          </Stack>

          <Typography variant="body2" color="text.secondary">
            작성자: {post.authorName} (#{post.authorId}) · 조회수: {post.viewCount} · 작성일: {post.createdAt}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="body2">updatedAt: {post.updatedAt ?? '-'}</Typography>
        </Paper>
      )}
    </Box>
  );
}
