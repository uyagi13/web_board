import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Typography from '@mui/material/Typography';
import ColorModeIconDropdown from '../../../shared-theme/ColorModeIconDropdown';
import SitemarkIcon from './SitemarkIcon';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  // 로그인 유저 정보 (/api/auth/me 응답)
  const [me, setMe] = React.useState(null);
  
  const [meLoading, setMeLoading] = React.useState(false);

  const toggleDrawer = (newOpen) => () => setOpen(newOpen);

  // ✅ 토큰은 localStorage에서 읽는다
  const token = localStorage.getItem('accessToken');
  const isLoggedIn = !!token;

  const go = (path) => () => {
    setOpen(false);
    navigate(path);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setMe(null);
    setOpen(false);
    navigate('/board');
  };

  // ✅ 토큰이 있으면 /api/auth/me 호출해서 사용자 이름 표시
  React.useEffect(() => {
    if (!token) {
      setMe(null);
      return;
    }

    const controller = new AbortController();

    async function loadMe() {
      setMeLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        // 토큰 만료/불량 → 로그아웃 처리
        if (!res.ok) {
          localStorage.removeItem('accessToken');
          setMe(null);
          return;
        }

        const data = await res.json();
        setMe(data);
        console.log("ME:", data);

      } catch (e) {
        // 네트워크/기타 오류: 일단 로그인 풀지 않고 정보만 비움
        setMe(null);
      } finally {
        setMeLoading(false);
      }
    }

    loadMe();
    return () => controller.abort();
  }, [token]);

  const displayName = me?.username ?? '사용자';

  const isAdmin = React.useMemo(() => {
  return Array.isArray(me?.roles) && me.roles.includes("ROLE_ADMIN");
}, [me]);

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ cursor: 'pointer' }} onClick={go('/board')} role="button" tabIndex={0}>
              <SitemarkIcon />
            </Box>
            <Typography
              variant="subtitle1"
              color="info"
              sx={{ fontWeight: 700, cursor: 'pointer' }}
              onClick={go('/board')}
            >
              Subject Board
            </Typography>
          </Box>

          {/* Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            <Button variant="text" color="info" size="small" onClick={go('/board')}>
              게시판
            </Button>
            <Button variant="text" color="info" size="small" onClick={go('/board')}>
              공지
            </Button>

            <Box sx={{ width: 12 }} />

            {isLoggedIn ? (
              <>
                <Typography variant="body2" color="info" sx={{ fontWeight: 800 }}>
                  {meLoading ? '로딩...' : displayName}
                </Typography>

                {/* ✅ 회원정보 수정 */}
                <Button color="info" variant="text" size="small" onClick={go('/edit')}>
                  회원정보 수정
                </Button>

                {/* ✅ 관리자 전용 */}
                {isAdmin && (
                  <Button color="warning" variant="text" size="small" onClick={go('/admin')}>
                    관리자 페이지
                  </Button>
                )}

                <Button color="primary" variant="outlined" size="small" onClick={logout}>
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button color="primary" variant="text" size="small" onClick={go('/signin')}>
                  로그인
                </Button>
                <Button color="primary" variant="contained" size="small" onClick={go('/signup')}>
                  회원가입
                </Button>
              </>
            )}

            <ColorModeIconDropdown />
          </Box>

          {/* Mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{ sx: { top: 'var(--template-frame-height, 0px)' } }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem onClick={go('/board')}>게시판</MenuItem>
                <MenuItem onClick={go('/board')}>공지</MenuItem>

                <Divider sx={{ my: 2 }} />

                {isLoggedIn ? (
                  <>
                    <MenuItem disabled>
                      <Typography color="info" sx={{ fontWeight: 800 }}>
                        {meLoading ? '로딩...' : displayName}
                      </Typography>
                    </MenuItem>

                    {/* ✅ 회원정보 수정 */}
                    <MenuItem onClick={go('/member/edit')}>회원정보 수정</MenuItem>

                    {/* ✅ 관리자 전용 */}
                    {isAdmin && <MenuItem onClick={go('/admin')}>관리자 페이지</MenuItem>}

                    <MenuItem>
                      <Button color="primary" variant="outlined" fullWidth onClick={logout}>
                        로그아웃
                      </Button>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem>
                      <Button color="primary" variant="contained" fullWidth onClick={go('/signup')}>
                        회원가입
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button color="primary" variant="outlined" fullWidth onClick={go('/signin')}>
                        로그인
                      </Button>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
