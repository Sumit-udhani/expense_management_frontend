import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    primary: {
      main: '#3b82f6',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#cbd5e1',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3b82f6',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3b82f6',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#f44336', 
          },
          '&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#f44336', 
          },
          '&.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#f44336', 
          },
        },
      },
    },
    // MuiLink: {
    //   styleOverrides: {
    //     root: {
    //       color: '#f8285a',
    //       textDecoration: 'none',
    //       '&:hover': {
    //         textDecoration: 'underline', 
    //       },
    //     },
    //   },
    // },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
