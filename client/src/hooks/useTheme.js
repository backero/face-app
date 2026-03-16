import { useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('treyfa-theme') || 'dark'
  );

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('treyfa-theme', next);
  };

  return { theme, toggleTheme };
}
