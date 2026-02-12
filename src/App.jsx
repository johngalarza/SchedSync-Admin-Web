import { AuthProvider } from './context/AuthProvider';
import { ProtectedRoute } from './components/protectedRoute/ProtectedRoute';
import { DashboardPage } from './components/dashboard/DashboardPage';

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    </AuthProvider>
  );
}