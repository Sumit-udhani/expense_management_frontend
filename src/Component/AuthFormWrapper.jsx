// components/AuthFormWrapper.jsx
import { Container, Box, useTheme } from '@mui/material';

export default function AuthFormWrapper({ children  }) {
  const theme = useTheme()
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: theme.palette.background.paper
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
