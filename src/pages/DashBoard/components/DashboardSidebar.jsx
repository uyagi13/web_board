import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidthExpanded = 260;
const drawerWidthCollapsed = 72;

function normalizePath(pathname) {
  if (pathname.startsWith('/admin/dashboard')) return '/admin/dashboard';
  if (pathname.startsWith('/admin/users')) return '/admin/users';
  if (pathname.startsWith('/admin/posts')) return '/admin/posts';
  if (pathname.startsWith('/admin/files')) return '/admin/files'; 
  if (pathname === '/admin') return '/admin/dashboard';
  
  return pathname;
}

export default function DashboardSidebar({ expanded, setExpanded, container }) {
  const navigate = useNavigate();
  const location = useLocation();
  const active = normalizePath(location.pathname);

  const width = expanded ? drawerWidthExpanded : drawerWidthCollapsed;

  const items = [
    { label: '대시보드', icon: <DashboardRoundedIcon />, path: '/admin/dashboard' },
    { label: '사용자 관리', icon: <PeopleRoundedIcon />, path: '/admin/users' },
    { label: '게시글 관리', icon: <ArticleRoundedIcon />, path: '/admin/posts' },
    { label: '첨부파일 관리', icon: <ArticleRoundedIcon />, path: '/admin/files' },
  ];

  return (
    <Drawer
      variant="permanent"
      container={container}
      PaperProps={{
        sx: {
          width,
          overflowX: 'hidden',
          whiteSpace: 'nowrap',
          transition: (t) => t.transitions.create('width'),
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
      sx={{ width, flexShrink: 0 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={() => setExpanded(!expanded)} aria-label="toggle sidebar">
          <ChevronLeftRoundedIcon
            sx={{
              transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </IconButton>
      </Box>

      <Divider />

      <List sx={{ p: 1 }}>
        {items.map((it) => (
          <ListItemButton
            key={it.path}
            selected={active === it.path}
            onClick={() => navigate(it.path)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              justifyContent: expanded ? 'flex-start' : 'center',
              px: expanded ? 1.5 : 1,
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: expanded ? 1.5 : 0, justifyContent: 'center' }}>
              {it.icon}
            </ListItemIcon>
            {expanded && <ListItemText primary={it.label} />}
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
