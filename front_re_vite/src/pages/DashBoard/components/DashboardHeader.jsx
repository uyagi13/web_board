import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

export default function DashboardHeader({
  logo,
  title,
  menuOpen,
  onToggleMenu,
}) {
  const navigate = useNavigate();

  const logout = () => {
    // ✅ 실제 로그아웃 처리
    localStorage.removeItem('accessToken');
    navigate('/signin', { replace: true });
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundImage: 'none',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton
          aria-label="toggle menu"
          onClick={() => onToggleMenu(!menuOpen)}
          edge="start"
        >
          <MenuRoundedIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {logo}
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {title || 'Admin'}
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* ✅ 우측 액션 버튼들 */}
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/board')}
          >
            게시판으로
          </Button>

          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={logout}
          >
            로그아웃
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
