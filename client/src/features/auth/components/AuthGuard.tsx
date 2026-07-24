import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.ts';

export function AuthGuard() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  return user ? <Outlet /> : <Navigate replace to="/login" state={{ from: location.pathname + location.search }} />;
}
