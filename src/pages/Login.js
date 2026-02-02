import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Card, CardBody } from '../components/Card';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = login(email, password, role);

    if (result.success) {
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <CardBody>
          <div className="auth-header">
            <h1 className="auth-logo">COPE Business</h1>
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          {/* Role Selection */}
          <div className="role-selector">
            <button
              type="button"
              className={`role-btn ${role === 'client' ? 'active' : ''}`}
              onClick={() => setRole('client')}
            >
              <span className="role-icon">👤</span>
              <span className="role-label">Client</span>
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              <span className="role-icon">⚙️</span>
              <span className="role-label">Admin</span>
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <Button variant="primary" className="btn-block" type="submit">
              Sign In as {role === 'admin' ? 'Admin' : 'Client'}
            </Button>
          </form>

          {role === 'client' && (
            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="auth-link">
                  Sign up here
                </Link>
              </p>
            </div>
          )}

          {/* Demo credentials hint */}
          <div className="demo-hint">
            <p><strong>Demo Credentials:</strong></p>
            {role === 'admin' ? (
              <p>admin@cope.com / admin123</p>
            ) : (
              <p>john@example.com / client123</p>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
