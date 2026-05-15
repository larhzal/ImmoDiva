import { useState } from "react";

import Logo from "../../assets/images/Logo.png";

import "../../styles/layout/Navbar.css";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

export default function Navbar() {

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);

  // Déconnexion
  const confirmLogout = async () => {

    setLoading(true);

    const token =
      localStorage.getItem("immodiva_token");

    try {

      await fetch(`${API_URL}/api/auth/logout`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },

      });

    } catch (err) {

      console.error(
        "[Navbar] Logout error:",
        err
      );

    } finally {

      localStorage.removeItem("immodiva_user");

      localStorage.removeItem("immodiva_token");

      window.location.href = "/";
    }
  };

  return (
    <>

      {/* Top Bar */}
      <div className="top-bar"></div>

      {/* Navbar */}
      <nav className="navbar">

        {/* Logo */}
        <div className="nav-logo">

          <img
            src={Logo}
            alt="Immo DIVA"
            className="logo-img"
          />

        </div>

        {/* Links */}
        <div className="nav-links">

          <a href="#" className="nav-link">
            Mon Espace
          </a>

          <a href="#" className="nav-link">
            Tarifs
          </a>

          <a href="#" className="nav-link">
            Ajouter une appartement à louer
          </a>

          {/* Logout */}
          <span
            className="nav-link logout-link"
            onClick={() => setShowModal(true)}
          >
            Déconnexion
          </span>

        </div>

      </nav>

      {/* Modal */}
      {showModal && (

        <div
          className="logout-modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="logout-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <h2>
              Déconnexion
            </h2>

            <p>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>

            <div className="logout-modal-actions">

              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Annuler
              </button>

              <button
                className="confirm-btn"
                onClick={confirmLogout}
                disabled={loading}
              >
                {loading
                  ? "Déconnexion..."
                  : "Oui, déconnecter"}
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}