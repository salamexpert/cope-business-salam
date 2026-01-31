import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          CopeBusiness
        </Link>

        {/* Menu Items */}
        <ul className="navbar-menu">
          <li>
            <Link
              to="/"
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className={`navbar-link ${isActive('/services') ? 'active' : ''}`}
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              to="/pricing"
              className={`navbar-link ${isActive('/pricing') ? 'active' : ''}`}
            >
              Pricing
            </Link>
          </li>
          <li>
            <Link
              to="/how-it-works"
              className={`navbar-link ${isActive('/how-it-works') ? 'active' : ''}`}
            >
              How It Works
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`navbar-link ${isActive('/contact') ? 'active' : ''}`}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Auth Buttons */}
        <div className="navbar-auth">
          <Link to="/login" className="navbar-login-btn">
            Login
          </Link>
          <Link to="/signup" className="navbar-signup-btn">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
