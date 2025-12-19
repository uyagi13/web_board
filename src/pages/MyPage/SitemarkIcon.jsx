import Box from '@mui/material/Box';

export default function SitemarkIcon() {
  return (
    <Box
      component="img"
      src="/images/FINS_logo.png"   // 
      alt="Site Logo"
      sx={{
        height: 35,            // 원하는 크기로 조절
        width: 'auto',
        mr: 2,
        display: 'block',
      }}
    />
  );
}
