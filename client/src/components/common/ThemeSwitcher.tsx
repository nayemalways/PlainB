import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type Theme } from '../../app/providers/theme.context.ts';
import { Button } from '../ui/button.tsx';

const nextTheme: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' };

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
  return (
    <Button
      aria-label={`Theme: ${theme}. Switch to ${nextTheme[theme]}`}
      title={`Theme: ${theme}`}
      variant="ghost"
      size="icon"
      onClick={() => setTheme(nextTheme[theme])}
    >
      <Icon className="size-5" />
    </Button>
  );
}
