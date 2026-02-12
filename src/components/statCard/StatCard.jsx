import './StatCard.css';

export const StatCard = ({ label, value, change, trend }) => {
  return (
    <div>
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <span className={`stat-change ${trend}`}>
          {trend === 'up' ? '↗' : '↘'} {change}
        </span>
      </div>

      <div className="stat-value">{value}</div>

      <div className="stat-bar">
      </div>
    </div>
  );
};
