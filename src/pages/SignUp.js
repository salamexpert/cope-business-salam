import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Card, CardBody } from '../components/Card';
import './Auth.css';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service');
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password);

    if (result.success) {
      if (result.needsConfirmation) {
        setConfirmationSent(true);
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  if (confirmationSent) {
    return (
      <div className="auth-container">
        <Card className="auth-card">
          <CardBody>
            <div className="auth-header">
              <h1 className="auth-logo">COPE Business</h1>
              <h2>Check Your Email</h2>
              <p>We've sent a confirmation link to <strong>{email}</strong>. Please check your inbox and click the link to activate your account.</p>
            </div>
            <div className="auth-footer">
              <p>
                Already confirmed?{' '}
                <Link to="/login" className="auth-link">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <CardBody>
          <div className="auth-header">
            <h1 className="auth-logo">COPE Business</h1>
            <h2>Create Account</h2>
            <p>Join COPE Business and manage your digital services</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

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
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>

            <Button variant="primary" className="btn-block" type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
