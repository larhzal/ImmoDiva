import { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Avatar from "../../assets/icons/Dashboard.png"
import StatCard from "../../components/layout/StatsCard";
import TabBar from "../../components/layout/TabBar";
import Loader from "../../components/ui/loader"; 
import "../../styles/profile/profile.css";

const TABS = ["Mes Annonces", "Les Demandes", "Mes Clients", "Mon Profile"];

const stats = [
  { label: "Mes Annonces", value: 15, color: "#0F2744" },
  { label: "Approuvée", value: 10, color: "#1E9E6B" },
  { label: "En Attente", value: 5, color: "#E87722" },
];


export default function ProfilePage() {
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("Mon Profile");

  return (
    <div className="page">
      <Navbar />

    <main className="main">
        <div className="pageHeader"> 
            {/* Top Part: Avatar + Greeting */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={Avatar} alt="Immo DIVA" className="avatar" />
            <div> 
                <h1 className="pageTitle">Mon Espace</h1> 
                <p className="pageSubtitle">Bienvenue, Lahlou Ali</p> 
            </div>
            </div>
            
            {/* Bottom Part: The Row of Cards */}
            <div className="statsRow">
            {stats.map((s) => (
                <StatCard key={s.label} {...s} />
            ))}
            </div>
        </div>

        <TabBar 
            tabs={TABS} 
            active={activeTab} 
            onChange={setActiveTab} 
        />

        {/* Content */}
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

// ── Profile Form ──────────────────────────────────────────────
// -- Inside ProfileForm --
function ProfileForm() {
  const [info, setInfo] = useState({ nom: "", email: "", prenom: "", tel: "", age: "", nationalite: "" });
  const [pass, setPass] = useState({ current: "", newPass: "", confirm: "" });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true); // Utilise le loader que nous avons configuré
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}` // Le token du login
          }
        });
        const data = await response.json();
        if (response.ok) {
          // Met à jour l'état 'info' avec les données de Supabase
          setInfo({
            nom: data.user.last_name,
            prenom: data.user.first_name,
            username: data.user.username,
            email: data.user.email, // Récupéré via getUserById dans le service
            tel: data.user.phone_number || "",
            nationalite: data.user.nationalite || ""
          });
        }
      } catch (error) {
        console.error("Erreur de chargement du profil", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle input changes for Personal Info
  const handleInfoChange = (e) =>
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Handle input changes for Password
  const handlePassChange = (e) =>
    setPass((p) => ({ ...p, [e.target.name]: e.target.value }));

  // --- Logic for Personal Information Update ---
  const handleUpdateInfo = async () => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(info),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Informations personnelles mises à jour !" });
      } else {
        setMessage({ type: "error", text: data.message || "Erreur lors de la mise à jour." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur de connexion au serveur." });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Logic for Password Update (Existing) ---
  const handleUpdatePassword = async () => {
    if (pass.newPass !== pass.confirm) {
      setMessage({ type: "error", text: "Les nouveaux mots de passe ne correspondent pas." });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ 
          currentPassword: pass.current,  // ← add this
          password: pass.newPass 
        }),
      });
      if (response.ok) {
        setMessage({ type: "success", text: "Mot de passe mis à jour !" });
        setPass({ current: "", newPass: "", confirm: "" });
      } else {
        const data = await response.json();
        setMessage({ type: "error", text: data.message || "Une erreur est survenue." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Impossible de contacter le serveur." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {message.text && (
      <p style={{
          color: message.type === "error" ? "#d93025" : "#1e7e34",
          fontWeight: "500",
          marginTop: "12px",
          textAlign: "center"
      }}>
          {message.text}
      </p>
      )}
      {/* ── Informations Personnelles Section ── */}
    <section className="section">
        <h3 className="sectionTitle">Informations Personnelles</h3>
        <div className="divider" />

        <div className="infoGrid">
            {/* Row 1 */}
            <Field label="Nom :" name="nom" value={info.nom} onChange={handleInfoChange} />
            <Field label="Email :" name="email" value={info.email} onChange={handleInfoChange} type="email" />
            
            {/* Row 2 */}
            <Field label="Prénom :" name="prenom" value={info.prenom} onChange={handleInfoChange} />
            <Field label="Numéro de Téléphone :" name="tel" value={info.tel} onChange={handleInfoChange} />

            {/* Row 3 */}
            <Field label="Âge :" name="age" value={info.age} onChange={handleInfoChange} />
            <Field label="Nationalité :" name="nationalite" value={info.nationalite} onChange={handleInfoChange} />
        </div>

        <div className="actionsRight">
            <button 
                className="btnModifier" 
                onClick={handleUpdateInfo}
                disabled={isLoading}
                >
            {isLoading ? "Chargement..." : "Modifier"}
            </button>
      </div>
    </section>

      <div className="divider" />

      {/* ── Password Section ── */}
      <section className="section">
        <h3 className="sectionTitle">Modifier votre mot de passe</h3>
        

        <div className="passGrid">
          <Field label="Mot de passe actuel :" name="current" value={pass.current} onChange={handlePassChange} type="password" />
          <Field label="Nouveau mot de passe :" name="newPass" value={pass.newPass} onChange={handlePassChange} type="password" />
          <Field label="Confirmer le mot de passe:" name="confirm" value={pass.confirm} onChange={handlePassChange} type="password" />
        </div>

        <div className="actionsRight">
          <button 
            className="btnPrimary" 
            onClick={handleUpdatePassword}
            disabled={isLoading}
            >
            {isLoading ? "Chargement..." : "Modifier le mot de passe"}
          </button>
        </div>
              {message.text && (
                <p style={{ 
                  color: message.type === "error" ? "#d93025" : "#1e7e34", 
                  marginBottom: "10px",
                  fontWeight: "500" 
                }}>
                  {message.text}
                </p>
              )}
      </section>
    </div>
  );
}

// ── Field ─────────────────────────────────────────────────────
function Field({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="field">
      <label className="fieldLabel">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

// ── Placeholder ───────────────────────────────────────────────
function PlaceholderTab({ name }) {
  return (
    <div className="placeholder">
      <p>Contenu de « {name} » à venir.</p>
    </div>
  );
}