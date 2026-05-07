import StatCard from "../layout/StatsCard";

export default function DashboardStats({ stats }) {
  return (
    <div className="statsRow">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          color={stat.color}
        />
      ))}
    </div>
  );
}