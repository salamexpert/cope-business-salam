import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminTopNav.css';

export default function AdminTopNav({ title }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const avatarUrl = user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || '')}&background=random`;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="admin-top-nav">
      <div className="top-nav-left">
        <h2 className="page-title">{title}</h2>
      </div>

      <div className="top-nav-right">
        <button className="notification-btn">
          <span className="notification-icon">🔔</span>
        </button>

        <div className="user-menu-container">
          <button
            className="user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <img src={avatarUrl} alt="Admin avatar" className="user-avatar" />
            <span className="user-name">{user?.name?.split(' ')[0] || 'Admin'}</span>
            <span className="dropdown-arrow">▼</span>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <img src={avatarUrl} alt="Admin avatar" className="user-dropdown-avatar" />
                <div>
                  <div className="user-dropdown-name">{user?.name || 'Admin'}</div>
                  <div className="user-dropdown-email">{user?.email || ''}</div>
                </div>
              </div>
              <div className="user-dropdown-divider" />
              <a href="/admin/settings" className="dropdown-item">Settings</a>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
