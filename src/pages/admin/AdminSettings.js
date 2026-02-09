import { useState } from 'react';
import { Card, CardHeader, CardBody, Button } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import AdminLayout from './AdminLayout';
import './AdminSettings.css';

export default function AdminSettings() {
  const { user, updateProfile } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setProfileLoading(true);

    const result = await updateProfile({ name: profile.name });

    if (result.success) {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      setProfileMsg({ type: 'error', text: result.error });
    }
    setProfileLoading(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwords.new.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match!' });
      return;
    }

    setPasswordLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: passwords.new
    });

    if (error) {
      setPasswordMsg({ type: 'error', text: error.message });
    } else {
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ current: '', new: '', confirm: '' });
    }
    setPasswordLoading(false);
  };

  return (
    <AdminLayout title="Settings">
      <div className="settings-grid">
        <Card>
          <CardHeader>
            <h3>Profile Information</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleProfileSave} className="settings-form">
              {profileMsg.text && (
                <div className={`settings-msg ${profileMsg.type}`}>{profileMsg.text}</div>
              )}
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input type="text" value="Administrator" disabled />
              </div>
              <Button type="submit" variant="primary" disabled={profileLoading}>
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3>Change Password</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handlePasswordChange} className="settings-form">
              {passwordMsg.text && (
                <div className={`settings-msg ${passwordMsg.type}`}>{passwordMsg.text}</div>
              )}
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>
              <Button type="submit" variant="primary" disabled={passwordLoading}>
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
