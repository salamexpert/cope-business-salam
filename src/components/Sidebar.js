import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Buy Services', path: '/services', icon: '🛍️' },
    { label: 'My Orders', path: '/orders', icon: '📦' },
    { label: 'Wallet', path: '/wallet', icon: '💰' },
    { label: 'Invoices', path: '/invoices', icon: '🧾' },
    { label: 'Support Tickets', path: '/tickets', icon: '🎟️' },
    { label: 'Settings', path: '/settings', icon: '⚙️' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>COPE Business</h1>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
