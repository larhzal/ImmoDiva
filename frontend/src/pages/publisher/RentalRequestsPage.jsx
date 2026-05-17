import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Loader from '../../components/ui/loader';
import { getDemandesRecues } from '../../services/rentalService';


import '../../styles/ui/rentalRequestDisplay.css';
import {Building2,MapPin,User2,Eye} from "lucide-react"
import Navbar from '../../components/layout/Navbar';
import TabBar from "../../components/layout/TabBar";
import { useAuth } from '../../hooks/useAuth';

const TABS = [
    { label: "Mes Annonces",  path: "/my-apartments" },
    { label: "Les Demandes",  path: "/demandes" },
    { label: "Mes Clients",   path: "/my-clients" },
    { label: "Mon Profile",   path: "/publisher-profile" },
];

// ── Status Badge ──────────────────────────────────────────────
function StatusBadge({ status }) {
    const map = {
        "accepted": { label: "Acceptée",  cls: "status-badge--approved" },
        "refused":  { label: "Refusée",   cls: "status-badge--rejected" },
    };
    const entry = map[status?.toLowerCase()];
    return (
        <span className={`status-badge ${entry ? entry.cls : "status-badge--pending"}`}>
            {entry ? entry.label : "En Attente"}
        </span>
    );
}

export default function RentalRequestsPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Les Demandes');
  const [page, setPage] = useState(1);

  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState('');

  const itemsParPage = 6;

  const { user, loading:authLoading } = useAuth();

useEffect(() => {
  if (!loading && !user) {
    navigate("/login");
  }
}, [user, authLoading, navigate]);

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const data = await getDemandesRecues();
      console.log(data);
      
      setDemandes(data || []);
      console.log(demandes);
      
    } catch (err) {
      setErreur('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(demandes.length / itemsParPage);

  const demandesPaginees = demandes.slice(
    (page - 1) * itemsParPage,
    page * itemsParPage,
  );

  const toStorageURL = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    return `https://fipyteeltzqzeifwdpca.supabase.co/storage/v1/object/public/appartements/${path}`;
  }



  if (loading) return <Loader />;

  if (erreur) {
    return (
      <div className="errorContainer">
        <p className="errorText">{erreur}</p>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="page">
      <div className="main">
        {/* ================= HEADER ================= */}
        <div className="pageHeader">
         <div className="pageHeader__user">
            <div className="avatar-initials">
              {user?.first_name[0]}
              {user?.last_name[0]}
            </div>
            <div>
                <h1 className="pageTitle">Mon Espace</h1>
                <p className="pageSubtitle">
                    Bienvenue, {user?.first_name} {user?.last_name}
                </p>
            </div>
        </div>
            
        </div>

        {/* ================= TABS ================= */}
        <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab}/>

{/* ================= CONTENT ================= */}
          <div className="tabContent">
            {activeTab === 'Les Demandes' && (
              <>
                {/* TABLE */}
                {demandesPaginees.length === 0 ? (
                  <p className="empty-text">Aucune demande reçue</p>
                ) : (
                  <div className="table-wrapper">
                    <table className="apartments-table">
                      <thead>
                        <tr>
                          <th>APPARTEMENT</th>
                          <th>CLIENT</th>
                          <th>STATUT</th>
                          <th>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {demandesPaginees.map((demande) => (
                          <tr key={demande.id} className="table-row">
                            
                            {/* Apartment Column (Thumbnail + Title + Address) */}
                            <td className="col-apartment">
                              <div className="apt-thumb-wrap">
                                <img
                                  src={demande?.Apartment?.Pictures?.[0]?.file_path
                                    ? toStorageURL(demande.Apartment.Pictures[0].file_path)
                                    : "/assets/images/apr.jpg"
                                  }
                                  alt={demande?.Apartment?.title}
                                  className="apt-thumb"
                                />
                                <div>
                                  <p className="apt-title">{demande?.Apartment?.title || '—'}</p>
                                  <p className="apt-address">
                                    <MapPin size={12} />
                                    {demande?.Apartment?.address || '—'}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Client Column */}
                            <td className="col-details">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div className="avatar-initials" style={{ width: '34px', height: '34px', fontSize: '13px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e2e8f0', color: '#FFF', fontWeight: '600', margin: 0 }}>
                                  {demande?.User?.first_name?.[0]?.toUpperCase()}
                                  {demande?.User?.last_name?.[0]?.toUpperCase()}
                                </div>
                                <div>
                                  <p style={{ fontWeight: '500', margin: 0, color: '#0f172a', fontSize: '14px' }}>
                                    {demande?.User
                                      ? `${demande.User.first_name} ${demande.User.last_name}`
                                      : '—'}
                                  </p>
                                  <p style={{ margin: 0, color: '#64748b', fontSize: '12px' }}>
                                    Client locataire
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Status Column */}
                            <td className="col-status">
                              <StatusBadge status={demande.response} />
                            </td>

                            {/* Actions Column */}
                            <td className="col-actions">
                              <div className="action-icons">
                                <button
                                  className="action-icon action-icon--view"
                                  title="Voir"
                                  onClick={() => navigate(`/demandes/${demande.id}`)}
                                >
                                  <Eye size={16} />
                                </button>
                              </div>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className={`btnPagination ${
                      page === 1 ? 'btnDisabled' : ''
                    }`}
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab !== 'Les Demandes' && (
            <div className="placeholder">
              <p>Contenu à venir</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
