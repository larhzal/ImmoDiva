// components/ui/StatsCard.jsx

import "../../styles/layout/StatsCard.css";

export default function StatsCard({ label, value, color, className = "" }) {
  return (
    <div className={`statCard ${className}`}>
      {/* Label keeps the specific color (Blue, Green, Orange) */}
      <p className="statLabel" style={{ color }}>{label}</p>
      
      {/* Value uses the default neutral color from CSS */}
      <p className="statValue">{value}</p>
    </div>
  );
}