// components/layout/TabBar.jsx
import { Link } from "react-router-dom";
import "../../styles/layout/TabBar.css";

export default function TabBar({ tabs, active, badges = {} }) {
  return (
    <nav className="tabBar">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`tabBtn ${active === tab.label ? "tabBtnActive" : ""}`}
        >
          {tab.label}
          {badges[tab.label] != null && (
            <span className="tabBadge">{badges[tab.label]}</span>
          )}
        </Link>
      ))}
    </nav>
  );
}