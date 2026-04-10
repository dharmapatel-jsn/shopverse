import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { to: '/admin',             label: 'Dashboard',     icon: 'DB', end: true },
  { to: '/admin/products',    label: 'Products',      icon: 'PR' },
  { to: '/admin/orders',      label: 'Orders',        icon: 'OR' },
  { to: '/admin/add-product', label: 'Add Product',   icon: 'AD' },
  { to: '/admin/profile',     label: 'Admin Profile', icon: 'AP' },
];

const Sidebar = ({ collapsed, setCollapsed, onLogout }) => (
  <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
    <div className="sidebar-logo">
      {!collapsed && (
        <span>
          Shop<b>Verse</b>
        </span>
      )}
      <button
        className="collapse-btn"
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
      >
        {collapsed ? '›' : '‹'}
      </button>
    </div>

    <nav className="sidebar-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <span className="sidebar-icon">{item.icon}</span>
          {!collapsed && <span>{item.label}</span>}
        </NavLink>
      ))}
    </nav>

    <button type="button" className="sidebar-logout" onClick={onLogout}>
      <span>LO</span>
      {!collapsed && <span>Logout</span>}
    </button>

  </aside>
);

export default Sidebar;
