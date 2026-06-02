import { useState } from "react";

import Logo from "../../assets/images/Logo.png";

import "../../styles/layout/Navbar.css";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

export default function Navbar() {

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);

  // Vérifier si utilisateur connecté
  const token =
    localStorage.getItem("immodiva_token");

  const isAuthenticated = !!token;

  const user = JSON.parse(localStorage.getItem('immodiva_user'));

  // console.log(user.role);
  
  // Déconnexion
  const confirmLogout = async () => {

    setLoading(true);

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
          <a href="/listings">
            <img
            src={Logo}
            alt="Immo DIVA"
            className="logo-img"
          />
          </a>
          

        </div>

        {/* Links */}
        <div className="nav-links">
        {isAuthenticated && user.role == 'Publisher' ? 
        <a href="/my-apartments" className="nav-link">
            Mon Espace
        </a>  : <a href="/client-profile" className="nav-link">
            Mon Espace
        </a>
      }
          

          <a href="/tarifs" className="nav-link">
            Tarifs
          </a>

          <a href="/about" className="nav-link">
            À propos
          </a>

          {isAuthenticated &&  user.role == 'Publisher' &&
          <a href="/addApartment" className="nav-link">
            Ajouter un appartement à louer
          </a>
          }
          

          {/* Auth Buttons */}
          {isAuthenticated ? (

            <span
              className="nav-link logout-link"
              onClick={() => setShowModal(true)}
            >
              Déconnexion
            </span>

          ) : (

            <>

              <a
                href="/login"
                className="nav-link"
              >
                Login
              </a>

              <a
                href="/register"
                className="register-btn"
              >
                Register
              </a>

            </>

          )}

        </div>

      </nav>

      {/* Logout Modal */}
      {showModal && isAuthenticated && (

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