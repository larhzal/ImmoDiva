import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Loader from '../../components/ui/loader';
import { getDemandesRecues } from '../../services/rentalService';


import '../../styles/ui/rentalRequestDisplay.css';
import {Building2,MapPin,User2,Eye} from "lucide-react"
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../hooks/useAuth';

const TABS = ['Mes Annonces', 'Les Demandes', 'Mes Clients', 'Mon Profile'];

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

  const stats = [
    { label: 'Mes Annonces', value: 15, color: '#0F2744',par:"Total des annonces" },
    {
      label: 'Approuvée',
      value: demandes.filter((d) => d.response === 'accepted').length,
      color: '#1E9E6B',
      par:"Annonces en Ligne",
    },
    {
      label: 'En Attente',
      value: demandes.filter((d) => !d.response || d.response === 'en_attente')
        .length,
      color: '#E87722',
      par:"En cours de validation"
    },
  ];

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
          <div className="avatar">
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

        {/* ================= STATS ================= */}
        <div className="statsRow">
          {stats.map((s) => (
            <div key={s.label} className="statCard">
              <div className="statContent">
                <p style={{ color: s.color }}>{s.label}</p>

                <h3>{s.value}</h3>

                <span>{s.par}</span>
              </div>

              <div className="statIcon" style={{ background: s.color }} />
            </div>
          ))}
        </div>

        <br />
        <br />

        {/* ================= TABS ================= */}
        <div className="tabBar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'tabActive' : 'tabItem'}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ================= CONTENT ================= */}
        <div className="tabContent">
          {activeTab === 'Les Demandes' && (
            <>
              {/* TABLE */}
              <div className="tableContainer">
                <div className="tableHeader">

                  <span className="tableHeaderCell">
                    <Building2 size={15} />
                    Appartement
                  </span>

                  <span className="tableHeaderCell">
                    <MapPin size={15} />
                    Adresse
                  </span>

                  <span className="tableHeaderCell">
                    <User2 size={15} />
                    Client
                  </span>

                  <span className="tableHeaderCell">
                    Status
                  </span>

                  <span className="tableHeaderCell">
                    <Eye size={15} />
                    Action
                  </span>

                </div>

                {demandesPaginees.length === 0 ? (
                  <p className="emptyText">Aucune demande reçue</p>
                ) : (
                  demandesPaginees.map((demande) => (
                    <div key={demande.id} className="tableRow">
                      <div className="apartmentCell">

                        {/* <div className="apartmentImageMini" /> */}
                        <img
                          src={demande?.Apartment?.Pictures?.[0]?.file_path
                          ? toStorageURL(demande.Apartment.Pictures[0].file_path)
                          : "/assets/images/apr.jpg"
                          }
                          alt={demande?.Apartment?.title}
                          className="apartmentImageMini"
                        />

                        <div>
                          <h4>
                            {demande?.Apartment?.title || '—'}
                          </h4>
                        </div>

                      </div>

                      <div className="addressBadge">
                        {demande?.Apartment?.address || '—'}
                      </div>

                      <div className="clientCell">

                        <div className="clientAvatar">
                          {demande?.User?.first_name?.[0]}
                        </div>

                        <div>
                          <h5>
                            {demande?.User
                              ? `${demande.User.first_name} ${demande.User.last_name}`
                              : '—'}
                          </h5>

                          <span>Client locataire</span>
                        </div>

                      </div>
                              <div
                        className={`statusBadge ${
                          demande.response === "accepted"
                            ? "statusAccepted"
                            : demande.response === "refused"
                            ? "statusRefused"
                            : "statusPending"
                        }`}
                      >
                        {
                          demande.response === "accepted"
                            ? "Acceptée"
                            : demande.response === "refused"
                            ? "Refusée"
                            : "En attente"
                        }
                      </div>
                      <span
                        className="viewLink"
                        onClick={() => navigate(`/demandes/${demande.id}`)}
                      >
                        Voir
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
