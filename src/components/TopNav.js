import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUser } from '../data/mockData';
import './TopNav.css';

export default function TopNav({ title }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="top-nav">
      <div className="top-nav-left">
        <h2 className="page-title">{title}</h2>
      </div>

      <div className="top-nav-right">
        <div className="balance-display">
          <span className="balance-label">Balance:</span>
          <span className="balance-amount">${mockUser.walletBalance.toFixed(2)}</span>
        </div>

        <button className="notification-btn">
          <span className="notification-icon">🔔</span>
        </button>

        <div className="user-menu-container">
          <button
            className="user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <img src={mockUser.avatar} alt="User avatar" className="user-avatar" />
            <span className="user-name">{mockUser.name.split(' ')[0]}</span>
            <span className="dropdown-arrow">▼</span>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <img src={mockUser.avatar} alt="User avatar" className="user-dropdown-avatar" />
                <div>
                  <div className="user-dropdown-name">{mockUser.name}</div>
                  <div className="user-dropdown-email">{mockUser.email}</div>
                </div>
              </div>
              <div className="user-dropdown-divider" />
              <a href="/settings" className="dropdown-item">Profile Settings</a>
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
