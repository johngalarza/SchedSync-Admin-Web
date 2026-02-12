import { useAuth } from '../../context/useAuth';
import './Navbar.css';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 4L44 14V34L24 44L4 34V14L24 4Z"
              fill="url(#gradient2)"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="24" cy="24" r="8" fill="currentColor" />
            <defs>
              <linearGradient id="gradient2" x1="4" y1="4" x2="44" y2="44">
                <stop offset="0%" stopColor="#ff6b6b" />
                <stop offset="100%" stopColor="#ff3838" />
              </linearGradient>
            </defs>
          </svg>
          <span>Dashboard</span>
        </div>

        <div className="navbar-actions">
          <div className="user-info">
            <div className="user-avatar">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <span className="user-email">{user?.email}</span>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};
