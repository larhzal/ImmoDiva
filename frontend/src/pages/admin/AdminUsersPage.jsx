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

  // SCRUM-129 & 133: Vérifier l'autorisation Admin avant l'action
  const checkAdminPermission = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase
      .from('User')
      .select('role')
      .eq('id', user.id)
      .single();

    return profile?.role?.toUpperCase() === 'ADMIN';
  };

  // SCRUM-130: Bloquer un utilisateur
  const handleBlock = async (userId) => {
    if (window.confirm("Voulez-vous vraiment bloquer cet utilisateur ?")) {
      const isAdmin = await checkAdminPermission();
      if (!isAdmin) return alert("Action réservée aux administrateurs");

      const { error } = await supabase
        .from('User')
        .update({ status: 'blocked' })
        .eq('id', userId);

      if (!error) {
        setUsers(users.map(u => u.id === userId ? { ...u, status: 'blocked' } : u));
      } else {
        alert("Erreur lors du blocage");
      }
    }
  };

  // SCRUM-134: Débloquer un utilisateur
  const handleUnblock = async (userId) => {
    if (window.confirm("Voulez-vous vraiment débloquer cet utilisateur ?")) {
      const isAdmin = await checkAdminPermission();
      if (!isAdmin) return alert("Action réservée aux administrateurs");

      const { error } = await supabase
        .from('User')
        .update({ status: 'active' }) 
        .eq('id', userId);

      if (!error) {
        setUsers(users.map(u => u.id === userId ? { ...u, status: 'active' } : u));
      } else {
        alert("Erreur lors du déblocage");
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
                  <span className={user.status?.toLowerCase() === 'active' || user.status?.toLowerCase() === 'unblocked' ? "status-active" : "status-blocked"}>
                    ● {user.status}
                  </span>
                </td>
                <td>
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