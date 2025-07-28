
import { Container, CssBaseline, ThemeProvider, createTheme, responsiveFontSizes, Box, IconButton, Tooltip } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { UserSearch } from './components/UserSearch.js'
import { useState, useMemo } from 'react'
import { ColorModeContext } from './context/ColorModeContext.js'

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode],
  );
  const theme = useMemo(() => {
    const baseTheme = createTheme({
      palette: {
        mode,
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
          default: mode === 'light' ? '#f5f5f5' : '#121212',
          paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
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
  }, [mode]);
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1100 }}>
          <Tooltip title={mode === 'dark' ? "Switch to light mode" : "Switch to dark mode"}>
            <IconButton
              onClick={colorMode.toggleColorMode}
              color="inherit"
              sx={{
                backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Box>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <UserSearch />
        </Container>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
