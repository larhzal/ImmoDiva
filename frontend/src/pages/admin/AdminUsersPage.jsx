import React from 'react';
import '../../styles/pages/adminUsers.css';

const AdminUsers = () => {
  const dummyUsers = [
    { id: 1, full_name: "Ahmed Alami", email: "ahmed@mail.com", role: "publisher", status: "Actif", date: "2024-05-10" },
    { id: 2, full_name: "Sara Benani", email: "sara@mail.com", role: "locataire", status: "Bloqué", date: "2024-05-11" },
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Gestion des Utilisateurs</h1>
        <button className="add-user-btn">+ Ajouter un utilisateur</button>
      </div>

      <div className="stat-card">
        <p className="stat-label">Total Utilisateurs</p>
        <p className="stat-value">{dummyUsers.length}</p>
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
            {dummyUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">{user.full_name.charAt(0)}</div>
                    <div>
                      <p className="user-name">{user.full_name}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge badge-${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td style={{color: '#374151', fontSize: '14px'}}>{user.date}</td>
                <td>
                  <span className={user.status === 'Actif' ? "status-active" : "status-blocked"}>
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

export default AdminUsers;