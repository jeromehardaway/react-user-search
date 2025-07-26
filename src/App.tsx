import { Container, CssBaseline, ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material'
import './App.css'
import './styles/UserSearch.css'
import { UserSearch } from './components/UserSearch.js'
import { useMemo } from 'react'

function App() {
  // Create a responsive theme
  const theme = useMemo(() => {
    const baseTheme = createTheme({
      palette: {
        mode: 'light',
        primary: {
          main: '#1976d2',
          light: '#42a5f5',
          dark: '#1565c0',
        },
        secondary: {
          main: '#9c27b0',
          light: '#ba68c8',
          dark: '#7b1fa2',
        },
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
      },
      typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 500,
        },
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: '0 2px 10px 0 rgba(0,0,0,0.05)',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 500,
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              fontWeight: 500,
            },
          },
        },
      },
    });

    return responsiveFontSizes(baseTheme);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <UserSearch />
      </Container>
    </ThemeProvider>
  )
}

export default App
