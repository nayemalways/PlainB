import { useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { ThemeContext, type Theme } from './theme.context.ts';

const applyTheme = (theme: Theme) => {
  const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
};

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem('plainb-theme') as Theme | null) ?? 'system',
  );

  useEffect(() => {
    applyTheme(theme);
    const media = matchMedia('(prefers-color-scheme: dark)');
    const listener = () => theme === 'system' && applyTheme(theme);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    setTheme: (next: Theme) => {
      localStorage.setItem('plainb-theme', next);
      setThemeState(next);
    },
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
