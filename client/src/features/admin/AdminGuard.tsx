import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../auth/store/auth.store.ts';
export function AdminGuard() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  return user?.role === 'ADMIN' ? (
    <Outlet />
  ) : (
    <Navigate replace to="/admin/login" state={{ from: location.pathname }} />
  );
}
