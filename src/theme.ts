// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Enable dark mode
    primary: {
      main: '#f07900',
      // main: '#f8a145',
    },
    secondary: {
      // main: '#03dac6',
      //main: '#005f73',
      main: '#0077b6',
    },
    background: {
      default: '#121212', // Dark background color
      paper: '#1e1e1e', // Darker card color
    },
    text: {
      primary: '#ffffff', // Light text color
      secondary: '#b0b0b0', // Slightly lighter text for secondary content
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#121212', // Ensures the body background is dark
        },
      },
    },
  },
});

export default theme;
