import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './AdminProfile.css';

const AdminProfile = ({ onLogout }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: 'Admin User',
    email: 'admin@shopverse.com',
    currentPassword: '',
    newPassword: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    window.alert('Profile updated successfully.');
    setForm((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
  };

  const handleLogout = () => {
    onLogout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-profile-page">
      <Header title="Admin Profile" />

      <div className="page-body">
        <div className="page-toolbar">
          <div>
            <h2>Account Settings</h2>
            <p className="subtitle">Manage your admin name, email, password, and logout.</p>
          </div>
        </div>

        <div className="admin-card profile-card">
          <form className="profile-form" onSubmit={handleSave}>
            <div className="form-group">
              <label>Admin Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>

            <div className="profile-actions">
              <button type="submit" className="btn-primary-admin">Save Changes</button>
              <button type="button" className="btn-delete" onClick={handleLogout}>Logout</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
