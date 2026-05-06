import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/admin/pendingApartments.css";


const PAGE_SIZE = 7;

export default function PendingApartments() {
  const [annonces, setAnnonces] = useState([]);
  const [stats, setStats] = useState({ total: 0, approuvees: 0, enAttente: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Confirmation modal state
  const [modal, setModal] = useState({
    open: false,
    type: null, // "valider" | "rejeter"
    annonce: null,
  });


  // Fetch paginated annonces pending validation
  const fetchAnnonces = async () => {
    setLoading(true);

    const res = await fetch("http://localhost:5000/apartments/pending");
    const data = await res.json();

    setAnnonces(data || []);
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/apartments/pending/stats");
      const data = await res.json();

      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // useEffect(() => {
  //   fetchStats();
  //   fetchAnnonces(page);
  // }, [page]);

  useEffect(() => {
    fetchAnnonces();
    fetchStats();
  }, []);

  // Open confirmation modal
  const openModal = (type, annonce) => {
    setModal({ open: true, type, annonce });
  };

  // Close modal without action
  const closeModal = () => {
    setModal({ open: false, type: null, annonce: null });
  };

  // Confirm action (valider or rejeter)
  const handleConfirm = async () => {
    if (!modal.annonce) return;

    try {
      const id = modal.annonce.id;

      let url = "";
      let method = "PUT";

      if (modal.type === "valider") {
        url = `http://localhost:5000/apartments/pending/${id}/validate`;
      } else if (modal.type === "rejeter") {
        url = `http://localhost:5000/apartments/pending/${id}/reject`;
      } else if (modal.type === "delete") {
        url = `http://localhost:5000/apartments/pending/${id}`;
        method = "DELETE";
      }

      const res = await fetch(url, { method });

      if (!res.ok) {
        console.error("Erreur action");
        return;
      }

      closeModal();
      fetchAnnonces();
      fetchStats();

    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  return (
    <div className="av-page">
      {/* Header */}
      <header className="av-header">
        <div className="av-header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="15" y2="12" />
            <circle cx="19" cy="17" r="3" />
            <line x1="21" y1="19" x2="23" y2="21" />
          </svg>
        </div>
        <div>
          <h1 className="av-title">Annonces en attente de validation</h1>
          <p className="av-subtitle">Bienvenue</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="av-stats">
        <div className="av-stat-card av-stat-total">
          <span className="av-stat-label">Annonces</span>
          <span className="av-stat-value">{stats.total}</span>
        </div>
        <div className="av-stat-card av-stat-approuvee">
          <span className="av-stat-label">Approuvée</span>
          <span className="av-stat-value">{stats.approuvees}</span>
        </div>
        <div className="av-stat-card av-stat-attente">
          <span className="av-stat-label">En Attente</span>
          <span className="av-stat-value">{stats.enAttente}</span>
        </div>
      </div>

      {/* Table */}
      <div className="av-table-wrapper">
        <table className="av-table">
          <thead>
            <tr>
              <th>Appartement</th>
              <th>Adresse</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="av-loading">Chargement...</td>
              </tr>
            ) : annonces.length === 0 ? (
              <tr>
                <td colSpan={4} className="av-empty">Aucune annonce en attente.</td>
              </tr>
            ) : (
              annonces.map((annonce) => (
                <tr key={annonce.id} className="av-row">
                  <td className="av-col-title">{annonce.title}</td>
                  <td className="av-col-address">{annonce.address}</td>
                  <td className="av-col-details">
                    <Link to={`/annonces/${annonce.id}`} className="av-details-link">
                      Voir les détails
                    </Link>
                  </td>
                  <td className="av-col-actions">
                    <button
                      className="av-btn av-btn-valider"
                      onClick={() => openModal("valider", annonce)}
                    >
                      Valider
                    </button>
                    <button
                      className="av-btn av-btn-rejeter"
                      onClick={() => openModal("rejeter", annonce)}
                    >
                      Rejeter
                    </button>
                    <button
                      className="av-btn av-btn-delete"
                      onClick={() => openModal("delete", annonce)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="av-pagination">
        <button
          className="av-page-btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Précédent
        </button>
        <span className="av-page-indicator">Page {page}</span>
        <button
          className="av-page-btn"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
        >
          Suivant
        </button>
      </div>

      {/* Confirmation Modal */}
      {modal.open && (
        <div className="av-modal-overlay" onClick={closeModal}>
          <div className="av-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`av-modal-icon ${modal.type === "valider" ? "icon-valider" : "icon-rejeter"}`}>
              {modal.type === "valider" ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
            </div>
            <h2 className="av-modal-title">
              {modal.type === "valider"
                ? "Valider cet appartement ?"
                : modal.type === "rejeter"
                  ? "Rejeter cet appartement ?"
                  : "Supprimer cet appartement ?"}
            </h2>

            <p className="av-modal-body">
              {modal.type === "valider"
                ? "Êtes-vous sûr de vouloir valider cet appartement ?"
                : modal.type === "rejeter"
                  ? "Êtes-vous sûr de vouloir rejeter cet appartement ?"
                  : "Êtes-vous sûr de vouloir supprimer cet appartement ? Cette action est irréversible."}
            </p>

            <p className="av-modal-name">{modal.annonce?.title}</p>
            <div className="av-modal-actions">
              <button className="av-modal-btn av-modal-no" onClick={closeModal}>
                Non
              </button>
              <button
                className={`av-modal-btn ${modal.type === "valider" ? "av-modal-yes-green" : "av-modal-yes-red"}`}
                onClick={handleConfirm}
              >
                Oui
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}