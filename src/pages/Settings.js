import { useState } from 'react';
import { Card, CardBody, CardHeader, Button } from '../components';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import './Settings.css';

export default function Settings() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: user?.phone || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg(null);

    const result = await updateProfile({
      name: formData.name,
      company: formData.company,
      phone: formData.phone
    });

    if (result.success) {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setProfileMsg({ type: 'error', text: result.error || 'Failed to update profile.' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordMsg({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (passwordForm.new.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordForm.new
    });

    if (error) {
      setPasswordMsg({ type: 'error', text: error.message });
    } else {
      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' });
      setPasswordForm({ current: '', new: '', confirm: '' });
    }
  };

  const msgStyle = (msg) => ({
    padding: '0.75rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2',
    color: msg.type === 'success' ? '#16a34a' : '#dc2626',
    fontSize: '0.875rem'
  });

  return (
    <DashboardLayout title="Settings">
      <div className="settings-container">
        <Card>
          <CardHeader>
            <h3>Profile Information</h3>
          </CardHeader>
          <CardBody>
            {profileMsg && <div style={msgStyle(profileMsg)}>{profileMsg.text}</div>}
            <form onSubmit={handleSaveProfile} className="settings-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleProfileChange}
                  placeholder="Your company name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleProfileChange}
                  placeholder="Your phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="joinDate">Member Since</label>
                <input
                  id="joinDate"
                  type="text"
                  value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  disabled
                />
              </div>

              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3>Change Password</h3>
          </CardHeader>
          <CardBody>
            {passwordMsg && <div style={msgStyle(passwordMsg)}>{passwordMsg.text}</div>}
            <form onSubmit={handleChangePassword} className="settings-form">
              <div className="form-group">
                <label htmlFor="new">New Password</label>
                <input
                  id="new"
                  type="password"
                  name="new"
                  value={passwordForm.new}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm">Confirm Password</label>
                <input
                  id="confirm"
                  type="password"
                  name="confirm"
                  value={passwordForm.confirm}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                />
              </div>

              <Button variant="primary" type="submit">
                Update Password
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
