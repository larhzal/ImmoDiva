import { useState } from "react";

import Logo from "../../assets/images/Logo.png";
import "../../styles/layout/Navbar.css";


const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";

export default function AdminNavbar() {

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("immodiva_token");

    const isAuthenticated = !!token;

    const user = JSON.parse(localStorage.getItem('immodiva_user'));

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
                "[AdminNavbar] Logout error:",
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
                    <a href="/admin-home">
                        <img
                            src={Logo}
                            alt="Immo DIVA"
                            className="logo-img"
                        />
                    </a>
                </div>

                {/* Logout only */}
                <div className="nav-links">

                    <span
                        className="nav-link logout-link"
                        onClick={() => setShowModal(true)}
                    >
                        Déconnexion
                    </span>

                </div>

            </nav>

            {/* Logout Modal */}
            {showModal && (

                <div
                    className="logout-modal-overlay"
                    onClick={() => setShowModal(false)}
                >

                    <div
                        className="logout-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <h2>Déconnexion</h2>

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