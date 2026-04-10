import './DashboardCard.css';

const DashboardCard = ({ title, value, icon, color, change }) => (
  <div className="dash-card" style={{ borderTopColor: color }}>
    <div className="dash-card-top">
      <div className="dash-card-icon" style={{ background: `${color}20`, color }}>
        {icon}
      </div>
      {typeof change === 'number' && (
        <span
          className="dash-card-change"
          style={{ color: change >= 0 ? '#4caf50' : '#f44336' }}
        >
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      )}
    </div>
    <div className="dash-card-value">{value}</div>
    <div className="dash-card-title">{title}</div>
  </div>
);

export default DashboardCard;
