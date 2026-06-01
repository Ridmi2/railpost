import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function RoleRoute({ allowedRoles }) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}