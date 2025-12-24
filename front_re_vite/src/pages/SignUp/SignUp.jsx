import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';

import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme';
import ColorModeSelect from '../../shared-theme/ColorModeSelect';
import signImage from './components/FINS_logo.png';

const API_BASE = import.meta.env.VITE_API_BASE || "http://192.168.1.235:8080";
/* ===================== styled ===================== */
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

/* ===================== component ===================== */
export default function SignUp(props) {
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');

  const [usernameError, setUsernameError] = React.useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');

  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const clearErrors = () => {
    setNameError(false);
    setNameErrorMessage('');
    setUsernameError(false);
    setUsernameErrorMessage('');
    setEmailError(false);
    setEmailErrorMessage('');
    setPasswordError(false);
    setPasswordErrorMessage('');
  };

  /* ===================== validation ===================== */
  const validateInputs = () => {
    const name = document.getElementById('name');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!name.value.trim()) {
      setNameError(true);
      setNameErrorMessage('이름을 입력해주세요.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    if (!username.value.trim()) {
      setUsernameError(true);
      setUsernameErrorMessage('아이디를 입력해주세요.');
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage('');
    }

    if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('올바른 이메일 형식을 입력해주세요.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('비밀번호는 6자 이상이어야 합니다.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  /* ===================== submit ===================== */
  const handleSubmit = async (event) => {
    event.preventDefault();
    clearErrors();

    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const payload = {
      name: data.get('name'),
      username: data.get('username'),
      email: data.get('email'),
      password: data.get('password'),
    };

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (res.ok) {
        window.location.href = '/signin';
        return;
      }

      let msg = '회원가입에 실패했습니다.';
      try {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const j = await res.json();
          msg = j?.message || msg;
        } else {
          msg = await res.text();
        }
      } catch (_) {}

      setUsernameError(true);
      setUsernameErrorMessage(msg);
    } catch (e) {
      setUsernameError(true);
      setUsernameErrorMessage('서버에 연결할 수 없습니다.');
    }
  };

  /* ===================== render ===================== */
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Box
            component="img"
            src={signImage}
            alt="Sign up"
            sx={{ width: 230, mx: 'auto', mb: 2 }}
          />
          <Typography component="h1" variant="h4">
            Sign up
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField id="name" name="name" fullWidth required error={nameError} helperText={nameErrorMessage} />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="username">ID</FormLabel>
              <TextField id="username" name="username" fullWidth required error={usernameError} helperText={usernameErrorMessage} />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField id="email" name="email" type="email" fullWidth required error={emailError} helperText={emailErrorMessage} />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField id="password" name="password" type="password" fullWidth required error={passwordError} helperText={passwordErrorMessage} />
            </FormControl>

            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="I want to receive updates via email."
            />

            <Button type="submit" fullWidth variant="contained" onClick={validateInputs}>
              Sign up
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography align="center">
            Already have an account?{' '}
            <Link component={RouterLink} to="/signin">
              Sign in
            </Link>
          </Typography>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
