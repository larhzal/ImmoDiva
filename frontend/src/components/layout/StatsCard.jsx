// components/layout/StatsCard.jsx
import "../../styles/layout/StatsCard.css";

export default function StatsCard({ label, value, color, subtitle, icon: Icon }) {
  return (
    <div className="statCard">
      <div className="statCard__left">
        <p className="statLabel" style={{ color }}>{label}</p>
        <p className="statValue">{value}</p>
        {subtitle && <p className="statSubtitle">{subtitle}</p>}
      </div>
      {Icon && (
        <div className="statCard__icon" style={{ color }}>
          <Icon size={28} strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}