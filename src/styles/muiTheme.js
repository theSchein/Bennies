// src/styles/muiTheme.js
import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    mode: 'light', // Default to light mode
    light: {
      primary: '#F5F5F5',
      secondary: '#F2EAD3',
      tertiary: '#DFD7BF',
      quaternary: '#3F2305',
      background: '#3F2305',
    },
    dark: {
      primary: '#E6E6E6',
      secondary: '#C5A880',
      tertiary: '#532E1C',
      quaternary: '#0F0F0F',
      background: '#0F0F0F',
    },
  },
  typography: {
    fontFamily: {
      heading: ['Gasoek One', 'sans-serif'],
      body: ['Josefin Sans', 'sans-serif'],
      subheading: ['lilita One', 'sans-serif'],
    },
  },
  components: {
    // Custom component styles go here
  },
  // Add more theme customization here as needed
});

export default muiTheme;
