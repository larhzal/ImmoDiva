// components/ui/TabBar.jsx
import "../../styles/layout/TabBar.css";


export default function TabBar({ tabs, active, onChange }) {
  return (
    <div className="tabBar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`tabBtn ${active === tab ? "tabBtnActive" : ""}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}