import { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import AdminProducts from './pages/AdminProducts';
import Orders from './pages/Orders';
import AddProduct from './pages/AddProduct';
import AdminProfile from './pages/AdminProfile';
import './styles/admin.css';

const AUTH_KEY = 'shopverse_admin_auth';

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function AdminLayout({ isAuthenticated, onSignIn, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const showSidebar = isAuthenticated && location.pathname !== '/admin/login';

  return (
    <div className="admin-layout">
      {showSidebar && (
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} onLogout={onLogout} />
      )}
      <div className="admin-main">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? '/admin' : '/admin/login'} replace />}
          />
          <Route
            path="/admin/login"
            element={
              isAuthenticated ? <Navigate to="/admin" replace /> : <AdminLogin onSignIn={onSignIn} />
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-product"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminProfile onLogout={onLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? '/admin' : '/admin/login'} replace />}
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(AUTH_KEY) === 'true'
  );

  const handleSignIn = () => {
    localStorage.setItem(AUTH_KEY, 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <AdminLayout
        isAuthenticated={isAuthenticated}
        onSignIn={handleSignIn}
        onLogout={handleLogout}
      />
    </Router>
  );
}

export default App;
