// components/ui/TabBar.jsx
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