import React, { useEffect, useState } from 'react';
import '../../styles/pages/adminUsers.css';
import '../../styles/layout/Navbar.css';
// Si ton CSS de pagination est centralisé ou si tu veux hériter des styles du composant "pendingApartments" :
import "../../styles/admin/pendingApartments.css"; 
import AdminNavbar from '../../components/layout/AdminNavbar';
import Loader from "../../components/ui/loader";

const API_URL = "http://localhost:5000/api/users";

const getToken = () => {
  return localStorage.getItem('immodiva_token');
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'block' ou 'unblock'
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // stats de pagination 
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const USERS_PER_PAGE = 6;

  
  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (currentPage) => {
    try {
      setLoading(true);
      const token = getToken();
      
      const res = await fetch(`${API_URL}?page=${currentPage}&limit=${USERS_PER_PAGE}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const json = await res.json();
      console.log("DONNEES", json);

      if (json && json.data && Array.isArray(json.data)) {
        setUsers(json.data);
        if (json.count !== undefined) {
          setTotalUsers(json.count);
          setTotalPages(Math.ceil(json.count / USERS_PER_PAGE) || 1);
        }
      } else if (Array.isArray(json)) {
        setUsers(json);
        setTotalUsers(json.length);
        setTotalPages(1);
      } else {
        console.error("[Frontend] Le format du JSON n'est pas reconnu", json);
        setUsers([]);
      }
    } catch (err) {
      console.error("[Frontend Error] Échec du fetchUsers:", err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const totalLocataires = users.filter(u => u.role?.toLowerCase() === 'client').length;
  const totalPublicateurs = users.filter(u => u.role?.toLowerCase() === 'publisher').length;

  const openModal = (userId, action) => {
    setSelectedUserId(userId);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    setActionLoading(true);
    const token = getToken();
    const res = await fetch(`${API_URL}/${selectedUserId}/${modalAction}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      setUsers(users.map(u =>
        u.id === selectedUserId
          ? { ...u, status: modalAction === 'blocked' ? 'blocked' : 'unblocked' }
          : u
      ));
    } else {
      alert("L'action a échoué, veuillez réessayer.");
    }
    setActionLoading(false);
    setShowModal(false);
  };

  if (loading) return (
    <>
      <AdminNavbar />
      <div className="admin-container">
        <Loader />
      </div>
    </>
  );

  return (
    <>
      <AdminNavbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>Gestion des Utilisateurs</h1>
        </div>

        <div className="stats-container" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div className="stat-card">
            <p className="stat-label">TOTAL UTILISATEURS</p>
            <h2 className="stat-value">{totalUsers}</h2>
          </div>
          <div className="stat-card">
            <p className="stat-label">NOMBRE DE LOCATAIRES</p>
            <h2 className="stat-value">{totalLocataires}</h2>
          </div>
          <div className="stat-card">
            <p className="stat-label">NOMBRE DE PUBLICATEURS </p>
            <h2 className="stat-value">{totalPublicateurs}</h2>
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Rôle</th>
                <th>Date d'inscription</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">{user.first_name?.charAt(0)}</div>
                      <div>
                        <p className="user-name">{user.first_name} {user.last_name}</p>
                        <p className="user-email">ID: {user.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${
                      user.role?.toUpperCase() === 'CLIENT' ? 'role-orange' :
                      user.role?.toUpperCase() === 'PUBLISHER' ? 'role-navy' :
                      'role-green'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={
                      user.status?.toLowerCase() === 'active' ||
                      user.status?.toLowerCase() === 'unblocked'
                        ? "status-active"
                        : "status-blocked"
                    }>
                      ● {user.status || 'unblocked'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {user.status?.toLowerCase() === 'blocked' ? (
                        <button className="btn-unblock" onClick={() => openModal(user.id, 'unblock')}>
                          Débloquer
                        </button>
                      ) : (
                        <button className="btn-block" onClick={() => openModal(user.id, 'block')}>
                          Bloquer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- BLOC PAGINATION IDENTIQUE À L'AUTRE COMPOSANT --- */}
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
      </div>

      {/* Modal bloquer/débloquer */}
      {showModal && (
        <div className="logout-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{modalAction === 'block' ? 'Bloquer' : 'Débloquer'}</h2>
            <p>
              {modalAction === 'block'
                ? 'Voulez-vous vraiment bloquer cet utilisateur ?'
                : 'Voulez-vous vraiment débloquer cet utilisateur ?'}
            </p>
            <div className="logout-modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)} disabled={actionLoading}>
                Annuler
              </button>
              <button className="confirm-btn" onClick={confirmAction} disabled={actionLoading}>
                {actionLoading ? 'En cours...' : 'Oui, confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsersPage;