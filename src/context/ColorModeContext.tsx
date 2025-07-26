import { createContext, useContext } from 'react';

// Create a context for the color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light' as 'light' | 'dark'
});

// Custom hook to use the color mode
export function useColorMode() {
  return useContext(ColorModeContext);
}
