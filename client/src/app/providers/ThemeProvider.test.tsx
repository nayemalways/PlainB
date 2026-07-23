import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeSwitcher } from '../../components/common/ThemeSwitcher.tsx';
import { ThemeProvider } from './ThemeProvider.tsx';

describe('theme switching', () => {
  beforeEach(() => localStorage.clear());

  it('cycles the stored theme without requiring a page reload', async () => {
    render(<ThemeProvider><ThemeSwitcher /></ThemeProvider>);
    const button = screen.getByRole('button', { name: /theme: system/i });
    await userEvent.click(button);
    expect(localStorage.getItem('plainb-theme')).toBe('light');
    expect(screen.getByRole('button', { name: /theme: light/i })).toBeInTheDocument();
  });
});
