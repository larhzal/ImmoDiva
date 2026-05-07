import Avatar from "../../assets/icons/Dashboard.png";

export default function DashboardHeader({ user }) {
  return (
    <div className="pageHeader">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={Avatar}
          alt="Dashboard Avatar"
          className="avatar"
        />

        <div>
          <h1 className="pageTitle">Mon Espace</h1>

          <p className="pageSubtitle">
            Bienvenue, {user?.prenom} {user?.nom}
          </p>
        </div>
      </div>
    </div>
  );
}