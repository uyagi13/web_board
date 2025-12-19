import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <React.Fragment>
      <Divider />
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Subject Board
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Powered by React + MUI
          </Typography>
        </Box>
      </Container>
    </React.Fragment>
  );
}
