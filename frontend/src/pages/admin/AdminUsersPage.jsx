import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/adminService';
import '../../styles/pages/adminUsers.css';

const AdminUsersPage = () => { 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('User') 
        .select('id, first_name, last_name, role, status, created_at');
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // SCRUM-130: Fonction pour bloquer un utilisateur
  const handleBlock = async (userId) => {
    if (window.confirm("Voulez-vous vraiment bloquer cet utilisateur ?")) {
      try {
        console.log("Blocage de l'utilisateur:", userId);
        // Hna ghadi t-zidi l-appel Supabase f l-mرحلة l-jaya
        alert("Utilisateur bloqué (Interface mise à jour)");
      } catch (err) {
        console.error("Erreur lors du blocage:", err);
      }
    }
  };

  // SCRUM-134: Fonction pour débloquer un utilisateur
  const handleUnblock = async (userId) => {
    if (window.confirm("Voulez-vous vraiment débloquer cet utilisateur ?")) {
      try {
        console.log("Déblocage de l'utilisateur:", userId);
        // Hna ghadi t-zidi l-appel Supabase f l-mرحلة l-jaya
        alert("Utilisateur débloqué (Interface mise à jour)");
      } catch (err) {
        console.error("Erreur lors du déblocage:", err);
      }
    }
  };

  if (loading) return <div className="admin-container">Chargement...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Gestion des Utilisateurs</h1>
      </div>

      <div className="stat-card">
        <p className="stat-label">Total Utilisateurs</p>
        <p className="stat-value">{users.length}</p>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Rôle</th>
              <th>Date d'inscription</th>
              <th>Statut</th>
              <th>Actions</th> {/* Zadna had l-colonne */}
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
                  <span className={user.status?.toLowerCase() === 'active' || user.status?.toLowerCase() === 'unblocked' ? "status-active" : "status-blocked"}>
                    ● {user.status}
                  </span>
                </td>
                <td>
                  {/* SCRUM-128 & SCRUM-132: Les boutons d'action */}
                  <div className="action-buttons">
                    {user.status?.toLowerCase() === 'blocked' ? (
                      <button className="btn-unblock" onClick={() => handleUnblock(user.id)}>
                        Débloquer
                      </button>
                    ) : (
                      <button className="btn-block" onClick={() => handleBlock(user.id)}>
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
    </div>
  );
};

export default AdminUsersPage;