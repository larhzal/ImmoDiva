import { useState, useEffect } from "react";
import validators, { validateForm } from "../../utils/validators";
import Navbar from "../../components/layout/Navbar";
import Avatar from "../../assets/icons/Dashboard.png";
import StatCard from "../../components/layout/StatsCard";
import TabBar from "../../components/layout/TabBar";
import Loader from "../../components/ui/loader";
import "../../styles/profile/profile.css";

// ── Constants ─────────────────────────────────────────────────
const API = "http://localhost:5000/api/auth";

const TABS = ["Mes Annonces", "Les Demandes", "Mes Clients", "Mon Profile"];

const STATS = [
  { label: "Mes Annonces", value: 15, color: "#0F2744" },
  { label: "Approuvée",    value: 10, color: "#1E9E6B" },
  { label: "En Attente",   value: 5,  color: "#E87722" },
];

const authHeaders = (extra = {}) => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  ...extra,
});

// ── Shared sub-components ─────────────────────────────────────
function Field({ label, name, value, onChange, type = "text", error }) {
  return (
    <div className="profile-field">
      <label className="field-label">{label}</label>
      <input
        className={`field-input${error ? " field-input--error" : ""}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function StatusBanner({ type, text }) {
  if (!text) return null;

  const isError = type === "error";
  const icon = isError ? (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6v5M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 10.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className={`status-banner status-banner--${type}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
}

function PlaceholderTab({ name }) {
  return (
    <div className="placeholder">
      <p>Contenu de « {name} » à venir.</p>
    </div>
  );
}

// ── Profile Form ──────────────────────────────────────────────
function ProfileForm() {
  const [info, setInfo] = useState({
    nom: "",
    prenom: "",
    age: "",
    email: "",
    tel: "",
    nationalite: "",
  });
  const [pass, setPass] = useState({ current: "", newPass: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  // ── Fetch user on mount ──
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API}/me`, {
          method: "GET",
          headers: authHeaders(),
        });
        const data = await res.json();
        if (res.ok) {
          setInfo({
            nom: data.user.last_name,
            prenom: data.user.first_name,
            username: data.user.username,
            email: data.user.email,
            tel: data.user.phone_number || "",
            nationalite: data.user.nationalite || "",
          });
        }
      } catch (err) {
        console.error("Erreur de chargement du profil", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // ── Handlers ──
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));
    const error = validators[name]?.(value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handlePassChange = (e) => {
    const { name, value } = e.target;
    setPass((prev) => ({ ...prev, [name]: value }));
    const error = validators[name]?.(value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleUpdateInfo = async () => {
    const formErrors = validateForm(info);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API}/update-profile`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(info),
      });
      const data = await res.json();
      setMessage({
        type: res.ok ? "success" : "error",
        text: res.ok
          ? "Informations personnelles mises à jour !"
          : data.message || "Erreur lors de la mise à jour.",
      });
    } catch {
      setMessage({ type: "error", text: "Erreur de connexion au serveur." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
  // Format validation (empty / too short / no uppercase / no digit)
  const formErrors = validateForm(pass);
  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }
 
  // Match check (runs only when both fields are individually valid)
  if (pass.newPass !== pass.confirm) {
    setErrors((prev) => ({
      ...prev,
      confirm: "Les mots de passe ne correspondent pas.",
    }));
    return;
  }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API}/reset-password`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ currentPassword: pass.current, password: pass.newPass }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Mot de passe mis à jour !" });
        setPass({ current: "", newPass: "", confirm: "" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.message || "Une erreur est survenue." });
      }
    } catch {
      setMessage({ type: "error", text: "Impossible de contacter le serveur." });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ──
  return (
    <div>
      {isLoading && <Loader />}
      <StatusBanner type={message.type} text={message.text} />

      {/* ── Informations Personnelles ── */}
      <section className="section">
        <h3 className="sectionTitle">Informations Personnelles</h3>
        <div className="divider" />

        <div className="infoGrid">
          <Field label="Nom :"          name="nom"         value={info.nom}         onChange={handleInfoChange} error={errors.nom} />
          <Field label="Email :"        name="email"       value={info.email}       onChange={handleInfoChange} type="email" error={errors.email} />
          <Field label="Prénom :"       name="prenom"      value={info.prenom}      onChange={handleInfoChange} error={errors.prenom} />
          <Field label="Tél :"          name="tel"         value={info.tel}         onChange={handleInfoChange} error={errors.tel} />
          <Field label="Âge :"          name="age"         value={info.age}         onChange={handleInfoChange} error={errors.age} />
          <Field label="Nationalité :"  name="nationalite" value={info.nationalite} onChange={handleInfoChange} error={errors.nationalite} />
        </div>

        <div className="actionsRight">
          <button className="btnModifier" onClick={handleUpdateInfo} disabled={isLoading}>
            {isLoading ? "Chargement..." : "Modifier"}
          </button>
        </div>
      </section>

      <div className="divider" />

      {/* ── Modifier le mot de passe ── */}
      <section className="section">
        <h3 className="sectionTitle">Modifier votre mot de passe</h3>

        <div className="passGrid">
          <Field label="Mot de passe actuel :"               name="current" value={pass.current} onChange={handlePassChange} type="password" error={errors.current}/>
          <Field label="Nouveau mot de passe :"              name="newPass" value={pass.newPass} onChange={handlePassChange} type="password" error={errors.newPass}/>
          <Field label="Confirmer le nouveau mot de passe :" name="confirm" value={pass.confirm} onChange={handlePassChange} type="password" error={errors.confirm}/>
        </div>

        <div className="actionsRight">
          <button className="btnPrimary" onClick={handleUpdatePassword} disabled={isLoading}>
            {isLoading ? "Chargement..." : "Modifier le mot de passe"}
          </button>
        </div>
      </section>
    </div>
  );
}

// ── Page shell ────────────────────────────────────────────────
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Mon Profile");

  return (
    <div className="page">
      <Navbar />

      <main className="main">
        <div className="pageHeader">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src={Avatar} alt="Immo DIVA" className="avatar" />
            <div>
              <h1 className="pageTitle">Mon Espace</h1>
              <p className="pageSubtitle">Bienvenue, Lahlou Ali</p>
            </div>
          </div>

          <div className="statsRow">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>

        <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

        <div className="tabContent">
          {activeTab === "Mon Profile" ? (
            <ProfileForm />
          ) : (
            <PlaceholderTab name={activeTab} />
          )}
        </div>
      </main>
    </div>
  );
}