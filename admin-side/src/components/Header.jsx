import './Header.css';

const Header = ({ title }) => (
  <header className="admin-header">
    <h2 className="admin-header-title">{title}</h2>

    <div className="admin-header-right">
      <span className="admin-date">
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </span>

      <div className="admin-profile">
        <div className="profile-avatar">A</div>
        <span>Admin</span>
      </div>
    </div>
  </header>
);

export default Header;
