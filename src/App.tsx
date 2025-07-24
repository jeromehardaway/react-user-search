import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './App.css'
import { UserSearch } from './components/UserSearch'

// Create a theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
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
