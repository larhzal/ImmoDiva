import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/adminService';
import '../../styles/pages/adminUsers.css';

const AdminUsersPage = () => { 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
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
    fetchUsers();
  }, []);

  if (loading) return <div className="admin-container">Chargement...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Gestion des Utilisateurs</h1>
        <button className="add-user-btn">+ Ajouter un utilisateur</button>
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
                  <span className={user.status === 'active' ? "status-active" : "status-blocked"}>
                    ● {user.status}
                  </span>
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