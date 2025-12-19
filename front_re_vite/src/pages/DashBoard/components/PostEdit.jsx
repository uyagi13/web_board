import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate, useParams } from 'react-router-dom';

export default function PostEdit() {
  const { postId } = useParams();
  const navigate = useNavigate();

  // TODO: API로 초기값 조회
  const [form, setForm] = React.useState({
    title: '샘플 게시글',
    status: 'PUBLISHED',
    content: '여기는 게시글 내용입니다.',
  });

  const onChange = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: API PATCH /admin/posts/:id (status/title/content 등)
    console.log('update post:', postId, form);
    navigate(`/admin/posts/${postId}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper variant="outlined" sx={{ p: 2, maxWidth: 900 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          게시글 수정
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          ID: {postId}
        </Typography>

        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField label="제목" value={form.title} onChange={onChange('title')} required />
            <TextField select label="상태" value={form.status} onChange={onChange('status')}>
              <MenuItem value="PUBLISHED">게시중</MenuItem>
              <MenuItem value="REPORTED">신고</MenuItem>
              <MenuItem value="DELETED">삭제</MenuItem>
            </TextField>
            <TextField
              label="내용"
              value={form.content}
              onChange={onChange('content')}
              multiline
              minRows={8}
            />

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate(`/admin/posts/${postId}`)}>
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
