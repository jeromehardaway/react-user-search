import { createContext, useContext } from 'react';

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'light' as 'light' | 'dark'
});

export function useColorMode() {
  return useContext(ColorModeContext);
}
