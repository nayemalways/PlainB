import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/auth.store.ts';
import { useCartStore } from '../../features/cart/store/cart.store.ts';
import { useWishlistStore } from '../../features/wishlist/store/wishlist.store.ts';
import { Header } from './Header.tsx';

const sessionUser = {
  userId: 'user-1',
  email: 'customer@example.com',
  role: 'USER' as const,
  name: 'PlainB Customer',
  profilePhoto: null,
  canChangePassword: true,
  csrfToken: null,
};

describe('Header account menu', () => {
  afterEach(() => {
    cleanup();
    useAuthStore.setState({ user: null });
  });

  it('shows account details and destinations when activated', async () => {
    useAuthStore.setState({ user: sessionUser });
    useCartStore.setState({ count: 0, loadCount: vi.fn().mockResolvedValue(undefined) });
    useWishlistStore.setState({ count: 0, loadCount: vi.fn().mockResolvedValue(undefined) });
    const user = userEvent.setup();

    render(<MemoryRouter><Header /></MemoryRouter>);

    const trigger = screen.getByRole('button', { name: /open account menu/i });
    await user.click(trigger);

    expect(screen.getByText('customer@example.com')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /profile & addresses/i })).toHaveAttribute('href', '/account/profile');
    expect(screen.getByRole('menuitem', { name: /settings/i })).toHaveAttribute('href', '/account/profile#security');
    expect(screen.getByRole('menuitem', { name: /orders/i })).toHaveAttribute('href', '/account/orders');
    expect(screen.getByRole('menuitem', { name: /wishlist/i })).toHaveAttribute('href', '/account/wishlist');
  });

  it('supports keyboard opening and Escape dismissal', async () => {
    useAuthStore.setState({ user: sessionUser });
    useCartStore.setState({ count: 0, loadCount: vi.fn().mockResolvedValue(undefined) });
    useWishlistStore.setState({ count: 0, loadCount: vi.fn().mockResolvedValue(undefined) });
    const user = userEvent.setup();

    render(<MemoryRouter><Header /></MemoryRouter>);

    const trigger = screen.getByRole('button', { name: /open account menu/i });
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('menuitem', { name: /settings/i })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menuitem', { name: /settings/i })).not.toBeInTheDocument();
  });
});
