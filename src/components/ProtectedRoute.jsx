import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center font-bold py-12">Loading...</div>; // Or a spinner
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}