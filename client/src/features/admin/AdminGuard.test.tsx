import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuthStore } from '../auth/store/auth.store.ts';
import { AdminGuard } from './AdminGuard.tsx';

const user = {
  userId: '1',
  email: 'person@example.com',
  name: 'Person',
  profilePhoto: null,
  canChangePassword: true,
  csrfToken: null,
};

describe('AdminGuard', () => {
  afterEach(() => {
    cleanup();
    useAuthStore.setState({ user: null });
  });
  const renderRoutes = () =>
    render(
      <MemoryRouter initialEntries={['/admin/products']}>
        <Routes>
          <Route path="/admin/login" element={<p>Admin login</p>} />
          <Route element={<AdminGuard />}>
            <Route path="/admin/products" element={<p>Products admin</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

  it('allows administrators', () => {
    useAuthStore.setState({ user: { ...user, role: 'ADMIN' } });
    renderRoutes();
    expect(screen.getByText('Products admin')).toBeInTheDocument();
  });

  it('redirects non-admin users', () => {
    useAuthStore.setState({ user: { ...user, role: 'USER' } });
    renderRoutes();
    expect(screen.getByText('Admin login')).toBeInTheDocument();
  });
});
