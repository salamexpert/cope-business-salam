import { useState } from 'react';
import { Card, CardHeader, CardBody, Button } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { mockAdmins } from '../../data/mockData';
import AdminLayout from './AdminLayout';
import './AdminSettings.css';

export default function AdminSettings() {
  const { user } = useAuth();
  const admin = mockAdmins.find(a => a.id === user?.id) || mockAdmins[0];

  const [profile, setProfile] = useState({
    name: admin.name,
    email: admin.email
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
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
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input type="text" value="Administrator" disabled />
              </div>
              <Button type="submit" variant="primary">
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
            <form onSubmit={handlePasswordChange} className="settings-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="Enter current password"
                />
              </div>
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
              <Button type="submit" variant="primary">
                Update Password
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </AdminLayout>
  );
}
