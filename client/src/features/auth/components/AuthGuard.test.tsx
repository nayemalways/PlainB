import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '../store/auth.store.ts';
import { AuthGuard } from './AuthGuard.tsx';

describe('AuthGuard', () => {
  beforeEach(() => useAuthStore.setState({ user: null, initialized: true, status: 'error' }));

  it('redirects an unauthenticated customer to login', () => {
    render(
      <MemoryRouter initialEntries={['/cart']}>
        <Routes>
          <Route element={<AuthGuard />}><Route path="/cart" element={<p>Cart</p>} /></Route>
          <Route path="/login" element={<p>Login page</p>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Cart')).not.toBeInTheDocument();
  });
});
