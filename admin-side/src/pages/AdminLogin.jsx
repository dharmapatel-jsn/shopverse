import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminAuth.css';

const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = 'admin@shopverse.com';
const ADMIN_PASSWORD = 'admin123';

const AdminLogin = ({ onSignIn }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please enter username and password');
      return;
    }

    const normalizedUsername = form.username.trim().toLowerCase();
    const isValidUsername = normalizedUsername === ADMIN_USERNAME || normalizedUsername === ADMIN_EMAIL;

    if (!isValidUsername || form.password !== ADMIN_PASSWORD) {
      setError('Invalid admin username or password');
      return;
    }

    setError('');
    onSignIn();
    navigate('/admin');
  };

  return (
    <div className="admin-auth-page">
      <form className="admin-auth-card" onSubmit={handleSubmit}>
        <h1>Admin Sign In</h1>
        <p>Log in to manage ShopVerse.</p>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <span className="admin-auth-error">{error}</span>}
        <button type="submit">Sign In</button>
        <span className="admin-auth-hint">Use: admin or admin@shopverse.com / admin123</span>
      </form>
    </div>
  );
};

export default AdminLogin;
