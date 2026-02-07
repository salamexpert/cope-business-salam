import { useState } from 'react';
import { Card, CardBody, CardHeader, Button } from '../components';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from './DashboardLayout';
import './Settings.css';

export default function Settings() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderUpdates: true,
    ticketUpdates: true,
    promotions: false
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert('Profile updated successfully');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordForm.new === passwordForm.confirm) {
      alert('Password changed successfully');
      setPasswordForm({ current: '', new: '', confirm: '' });
    } else {
      alert('Passwords do not match');
    }
  };

  const handleNotificationSave = () => {
    alert('Notification preferences updated');
  };

  return (
    <DashboardLayout title="Settings">
      <div className="settings-container">
        <Card>
          <CardHeader>
            <h3>Profile Information</h3>
          </CardHeader>
          <CardBody>
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
                  onChange={handleProfileChange}
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
            <form onSubmit={handleChangePassword} className="settings-form">
              <div className="form-group">
                <label htmlFor="current">Current Password</label>
                <input
                  id="current"
                  type="password"
                  name="current"
                  value={passwordForm.current}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                />
              </div>

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

        <Card>
          <CardHeader>
            <h3>Notification Preferences</h3>
          </CardHeader>
          <CardBody>
            <div className="settings-form">
              <div className="preference-item">
                <div className="preference-info">
                  <h4>Email Notifications</h4>
                  <p>Receive email notifications for important updates</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={() => handleNotificationChange('emailNotifications')}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <h4>Order Updates</h4>
                  <p>Get notified when your orders are updated</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.orderUpdates}
                    onChange={() => handleNotificationChange('orderUpdates')}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <h4>Support Ticket Updates</h4>
                  <p>Receive notifications for ticket responses</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.ticketUpdates}
                    onChange={() => handleNotificationChange('ticketUpdates')}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <h4>Promotional Emails</h4>
                  <p>Receive special offers and promotions</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.promotions}
                    onChange={() => handleNotificationChange('promotions')}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>

              <Button variant="primary" onClick={handleNotificationSave}>
                Save Preferences
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
