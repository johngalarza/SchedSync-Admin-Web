import { useAuth } from '../../context/useAuth';
import { LoginPage } from '../login/LoginPage';
import { LoadingSpinner } from '../loading/LoadingSpinner';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return children;
};