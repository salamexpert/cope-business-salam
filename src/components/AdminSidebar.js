import { Link, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

export default function AdminSidebar() {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: '📊' },
    { label: 'Clients', path: '/admin/clients', icon: '👥' },
    { label: 'Tickets', path: '/admin/tickets', icon: '🎟️' },
    { label: 'Invoices', path: '/admin/invoices', icon: '🧾' },
    { label: 'Reports', path: '/admin/reports', icon: '📋' },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        <h1>COPE Admin</h1>
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
