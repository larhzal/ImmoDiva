import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import DashboardStats from '../../components/dashboard/DashboardStats';

import TabBar from '../../components/layout/TabBar';
import Loader from '../../components/ui/loader';

import { getDemandesRecues } from '../../services/rentalService';

import '../../styles/profile/profile.css';
import '../../styles/ui/rentalRequestDisplay.css'

const TABS = ['Mes Annonces', 'Les Demandes', 'Mes Clients', 'Mon Profile'];

export default function RentalRequestsPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Les Demandes');

  const [user] = useState({
    prenom: 'Ali',
    nom: 'Lahlou',
  });

  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');
  const [page, setPage] = useState(1);

  const itemsParPage = 7;

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const data = await getDemandesRecues();
      setDemandes(data || []);
    } catch (err) {
      setErreur('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Mes Annonces', value: 15, color: '#0F2744' },
    {
      label: 'Approuvée',
      value: demandes.filter((d) => d.response === 'accepted').length,
      color: '#1E9E6B',
    },
    {
      label: 'En Attente',
      value: demandes.filter((d) => !d.response || d.response === 'en_attente')
        .length,
      color: '#E87722',
    },
  ];

  const totalPages = Math.ceil(demandes.length / itemsParPage);

  const demandesPaginees = demandes.slice(
    (page - 1) * itemsParPage,
    page * itemsParPage,
  );

  if (loading) return <Loader />;

  if (erreur) {
    return (
      <div className="errorContainer">
        <p className="errorText">{erreur}</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader user={user} />

      <DashboardStats stats={stats} /><br /><br />

      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="tabContent">
        {activeTab === 'Les Demandes' && (
          <>
            {/* TABLE */}
            <div className="tableContainer">
              <div className="tableHeader">
                {['Appartement', 'Adresse', 'Client', ''].map((col) => (
                  <span key={col} className="tableHeaderCell">
                    {col}
                  </span>
                ))}
              </div>

              {demandesPaginees.length === 0 ? (
                <p className="emptyText">Aucune demande reçue</p>
              ) : (
                demandesPaginees.map((demande, index) => (
                  <div key={demande.id} className="tableRow">
                    <span>{demande?.Apartment?.title || '—'}</span>

                    <span>{demande?.Apartment?.address || '—'}</span>

                    <span>
                      {demande?.User
                        ? `${demande.User.first_name} ${demande.User.last_name}`
                        : '—'}
                    </span>

                    <span
                      className="viewLink"
                      onClick={() => navigate(`/demandes/${demande.id}`)}
                    >
                      Voir la demande
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className={`btnPagination ${
                    page === 1 ? 'btnDisabled' : ''
                  }`}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Précédent
                </button>

                <button className="btnPagination btnCurrent">
                  Page {page}
                </button>

                <button
                  className={`btnPagination ${
                    page === totalPages ? 'btnDisabled' : ''
                  }`}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'Mes Clients' && (
          <div className="placeholder">
            <p>Liste des clients à venir.</p>
          </div>
        )}

        {activeTab === 'Mon Profile' && (
          <div className="placeholder">
            <p>Page profil à venir.</p>
          </div>
        )}

        {activeTab === 'Mes Annonces' && (
          <div className="placeholder">
            <p>Liste des annonces à venir.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}