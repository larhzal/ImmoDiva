// src/components/layout/Navbar.jsx

import { useState } from "react";
import Logo from "../../assets/images/Logo.png";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [loading,   setLoading]   = useState(false);

  // ── Déconnexion effective ─────────────────────────────────────────────────
  const confirmLogout = async () => {
    setLoading(true);
    const token = localStorage.getItem("immodiva_token");

    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("[Navbar] Logout error:", err);
    } finally {
      localStorage.removeItem("immodiva_user");
      localStorage.removeItem("immodiva_token");
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav style={styles.navbar}>
        {/* Logo */}
        <div style={styles.navLogo}>
          <img src={Logo} alt="Immo DIVA" style={styles.logoImg} />
        </div>

        {/* Liens */}
        <div style={styles.navLinks}>
          <a href="#" style={styles.navLink}>Mon Espace</a>
          <a href="#" style={styles.navLink}>Notifications</a>
          <a href="#" style={styles.navLink}>Ajouter une Appartement à Louer</a>

          {/* Déconnexion — même style que les autres liens */}
          <span
            style={styles.navLink}
            onClick={() => setShowModal(true)}
          >
            Déconnexion
          </span>
        </div>
      </nav>

      {/* ── Modale de confirmation ───────────────────────────────────────── */}
      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div
            style={styles.modal}
            onClick={(e) => e.stopPropagation()} // empêcher fermeture au clic intérieur
          >
            {/* Icône */}
            <div style={styles.iconWrapper}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16 17l5-5-5-5M21 12H9M13 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h6a2 2 0 002-2v-2"
                  stroke="#C1622A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Texte */}
            <h2 style={styles.modalTitle}>Déconnexion</h2>
            <p style={styles.modalText}>
              Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
            </p>

            {/* Boutons */}
            <div style={styles.modalActions}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowModal(false)}
                disabled={loading}
                onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              >
                Annuler
              </button>
              <button
                style={styles.confirmBtn}
                onClick={confirmLogout}
                disabled={loading}
                onMouseEnter={e => e.currentTarget.style.background = "#a0471e"}
                onMouseLeave={e => e.currentTarget.style.background = "#C1622A"}
              >
                {loading ? "Déconnexion..." : "Oui, déconnecter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  // Navbar
  navbar: {
    background:   "#ffffff",
    display:      "flex",
    alignItems:   "center",
    justifyContent: "space-between",
    padding:      "0 40px",
    height:       102,
    borderBottom: "1px solid #e8eaed",
  },
  navLogo: {
    display:    "flex",
    alignItems: "center",
    marginTop:  10,
  },
  logoImg: {
    height:     50,
    objectFit:  "contain",
    margin:     20,
    padding:    20,
  },
  navLinks: {
    display:    "flex",
    gap:        32,
    alignItems: "center",
  },
  navLink: {
    color:          "#333",
    textDecoration: "none",
    fontSize:       14,
    whiteSpace:     "nowrap",
    cursor:         "pointer",
  },

  // Overlay (fond sombre derrière la modale)
  overlay: {
    position:        "fixed",
    inset:           0,
    background:      "rgba(0, 0, 0, 0.45)",
    display:         "flex",
    alignItems:      "center",
    justifyContent:  "center",
    zIndex:          1000,
    backdropFilter:  "blur(2px)",
  },

  // Modale
  modal: {
    background:   "#fff",
    borderRadius: 20,
    padding:      "2.5rem 2rem",
    width:        "100%",
    maxWidth:     400,
    textAlign:    "center",
    boxShadow:    "0 20px 60px rgba(0,0,0,0.15)",
    display:      "flex",
    flexDirection:"column",
    alignItems:   "center",
    gap:          "1rem",
  },
  iconWrapper: {
    background:   "#fff4ee",
    borderRadius: "50%",
    width:        64,
    height:       64,
    display:      "flex",
    alignItems:   "center",
    justifyContent: "center",
    marginBottom: "0.25rem",
  },
  modalTitle: {
    fontSize:   "1.3rem",
    fontWeight: 700,
    color:      "#1a1a1a",
    margin:     0,
  },
  modalText: {
    fontSize:   "0.9rem",
    color:      "#666",
    margin:     0,
    lineHeight: 1.6,
  },
  modalActions: {
    display:       "flex",
    gap:           "0.75rem",
    marginTop:     "0.5rem",
    width:         "100%",
  },
  cancelBtn: {
    flex:         1,
    padding:      "0.7rem",
    border:       "1.5px solid #e0e0e0",
    borderRadius: 10,
    background:   "#fff",
    fontSize:     "0.9rem",
    fontWeight:   600,
    color:        "#555",
    cursor:       "pointer",
    transition:   "background 0.2s",
  },
  confirmBtn: {
    flex:         1,
    padding:      "0.7rem",
    border:       "none",
    borderRadius: 10,
    background:   "#C1622A",
    fontSize:     "0.9rem",
    fontWeight:   600,
    color:        "#fff",
    cursor:       "pointer",
    transition:   "background 0.2s",
  },
};