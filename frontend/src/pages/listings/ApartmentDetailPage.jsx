import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaBed, 
  FaSquare, 
  FaArrowUp, 
  FaBath,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
  FaPen,
  FaPhoneAlt,
  FaCar,          
  FaCouch,        
  FaSwimmingPool, 
  FaLeaf,         
  FaPaw,          
  FaSmoking,      
  FaUsers,        
  FaLightbulb     
} from 'react-icons/fa'; 
import { 
  MdElevator,     
  MdSecurity      
} from 'react-icons/md';

import FeedbackList from '../../components/feedback/FeedbackList';
import '../../styles/pages/ApartmentDetails.css'
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../hooks/useAuth';
import AdminNavbar from '../../components/layout/AdminNavbar'
import Loader from '../../components/ui/loader';

const ApartmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [feedbackRefresh, setFeedbackRefresh] = useState(0);
  const {user, LoadingUser} = useAuth()

  const fetchApartmentDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/annonces/${id}`);
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Appartement non trouvé' : 'Erreur lors de la récupération des détails');
      }
      setApartment(await response.json());
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { 
    if (id) fetchApartmentDetails();
  }, [id, fetchApartmentDetails]);

  const pictures = apartment?.Pictures || [];
  const imgUrl = (path) =>
    `https://fipyteeltzqzeifwdpca.supabase.co/storage/v1/object/public/appartements/${path}`;
  const currentImage = pictures.length > 0
    ? imgUrl(pictures[currentImageIndex].file_path)
    : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80';

  const handlePrev = () => setCurrentImageIndex(p => p === 0 ? pictures.length - 1 : p - 1);
  const handleNext = () => setCurrentImageIndex(p => p === pictures.length - 1 ? 0 : p + 1);

  const boolLabel = (val) => {
    if (val === null || val === undefined || val === '') return null;
    return String(val) === 'true' || val === true;
  };

  
  const amenities = apartment ? [
    { key: 'elevator',   label: 'Ascenseur',  icon: <MdElevator size={18} /> },
    { key: 'parking',    label: 'Parking',    icon: <FaCar size={18} /> },
    { key: 'furnitured', label: 'Meublé',     icon: <FaCouch size={18} /> },
    { key: 'pool',       label: 'Piscine',    icon: <FaSwimmingPool size={18} /> },
    { key: 'balcony',    label: 'Balcon',     icon: <FaLeaf size={16} /> },
    { key: 'concierge',  label: 'Gardien',    icon: <MdSecurity size={18} /> },
  ].filter(a => boolLabel(apartment[a.key]) !== null) : [];

  
  const conditions = apartment ? [
    { key: 'animals_accepted',   label: 'Animaux acceptés', icon: <FaPaw size={18} /> },
    { key: 'smokers_accepted',   label: 'Fumeurs acceptés', icon: <FaSmoking size={18} /> },
    { key: 'rommates_accepted',  label: 'Colocataires',     icon: <FaUsers size={18} /> },
    { key: 'charges_included',   label: 'Charges incluses', icon: <FaLightbulb size={18} /> },
  ].filter(c => boolLabel(apartment[c.key]) !== null) : [];

  if (loading) return (
    <div className="adp-state">
      <div className="adp-spinner" />
      <p>Chargement de l'annonce…</p>
    </div>
  );

  if (error) return (
    <div className="adp-state">
      <div className="adp-state-icon">😕</div>
      <h2>Une erreur est survenue</h2>
      <p>{error}</p>
      <button className="adp-btn-primary" style={{marginTop:8,borderRadius:10,border:'none',cursor:'pointer',padding:'12px 24px',fontFamily:'DM Sans,sans-serif',fontSize:14,fontWeight:600,background:'#E8A020',color:'#fff'}} onClick={fetchApartmentDetails}>Réessayer</button>
      <button className="adp-btn-secondary" style={{borderRadius:10,border:'1.5px solid #EFEFEF',cursor:'pointer',padding:'11px 24px',fontFamily:'DM Sans,sans-serif',fontSize:14,fontWeight:500,background:'#fff',color:'#1A1A2E'}} onClick={() => navigate(user.role === 'Client' || user.role === 'Publisher' ? '/listings' : '/admin-home')}>Retour aux annonces</button>
    </div>
  );

  if (!apartment) return (
    <div className="adp-state">
      <div className="adp-state-icon">🏚️</div>
      <h2>Appartement introuvable</h2>
      <button className="adp-btn-secondary" onClick={() => navigate(user.role === 'Admin' ? '/admin-home' : '/listings')}>Retour aux annonces</button>
    </div>
  );

  if (LoadingUser) {
    return (
      <div className="adp-state">
        <Loader/>
      </div>
    );
  }

  const profilTags = Array.isArray(apartment.roomer_profil_desired) ? apartment.roomer_profil_desired : [];

  return (
    <>
      {user?.role === 'Client' || user?.role === 'Publisher' ? <Navbar/> : <AdminNavbar/>}
      
      <div className="adp-page">
        {/* Top bar */}
        <div className="adp-topbar">
          <button className="adp-back-btn" onClick={() => navigate(user.role === 'Admin' ? '/admin-home' : '/listings')}>
            <FaArrowLeft style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} /> Retour aux annonces
          </button>
          <div className="adp-breadcrumb">
            / <span>{apartment.title || 'Appartement'}</span>
          </div>
        </div>

        {/* Main 2-col grid */}
        <div className="adp-container">
          {/* gallery + details */}
          <div className="adp-content">
            {/* Gallery */}
            <div className="adp-gallery">
              <div className="adp-main-img-wrap">
                <img src={currentImage} alt={apartment.title || 'Appartement'} className="adp-main-img" />
                {pictures.length > 1 && (
                  <>
                    <button className="adp-nav-btn adp-prev" onClick={handlePrev}><FaChevronLeft /></button>
                    <button className="adp-nav-btn adp-next" onClick={handleNext}><FaChevronRight /></button>
                    <div className="adp-img-counter">{currentImageIndex + 1} / {pictures.length}</div>
                  </>
                )}
              </div>
              {pictures.length > 1 && (
                <div className="adp-thumbs">
                  {pictures.map((pic, i) => (
                    <img
                      key={pic.id}
                      src={imgUrl(pic.file_path)}
                      alt={`Vue ${i + 1}`}
                      className={`adp-thumb ${i === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(i)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            {apartment.description && (
              <div className="adp-section">
                <div className="adp-section-title">Description</div>
                <p className="adp-description">{apartment.description}</p>
              </div>
            )}

            {/* Details */}
            <div className="adp-section">
              <div className="adp-section-title">Caractéristiques</div>
              <div className="adp-details-grid">
                {apartment.surface && (
                  <div className="adp-detail-item">
                    <span className="adp-detail-label">Surface</span>
                    <span className="adp-detail-value">{apartment.surface} m²</span>
                  </div>
                )}
                {apartment.number_rooms && (
                  <div className="adp-detail-item">
                    <span className="adp-detail-label">Chambres</span>
                    <span className="adp-detail-value">{apartment.number_rooms}</span>
                  </div>
                )}
                {apartment.number_bathrooms && (
                  <div className="adp-detail-item">
                    <span className="adp-detail-label">Salles de bain</span>
                    <span className="adp-detail-value">{apartment.number_bathrooms}</span>
                  </div>
                )}
                {apartment.floor !== undefined && apartment.floor !== null && apartment.floor !== '' && (
                  <div className="adp-detail-item">
                    <span className="adp-detail-label">Étage</span>
                    <span className="adp-detail-value">{apartment.floor}</span>
                  </div>
                )}
                {apartment.city && (
                  <div className="adp-detail-item">
                    <span className="adp-detail-label">Ville</span>
                    <span className="adp-detail-value">{apartment.city}</span>
                  </div>
                )}
                {apartment.deposit_required && (
                    <div className="adp-detail-item">
                        <span className="adp-detail-label">Nécessité du Caution : </span>
                        <span className="adp-detail-value">{Boolean(apartment.deposit_required) ? "Oui" : "Non"}</span>
                    </div>
                )}
                {apartment.address && (
                  <div className="adp-detail-item" style={{gridColumn: apartment.address.length > 20 ? 'span 2' : 'span 1'}}>
                    <span className="adp-detail-label">Adresse</span>
                    <span className="adp-detail-value">{apartment.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities  */}
            {amenities.length > 0 && (
              <div className="adp-section">
                <div className="adp-section-title">Équipements</div>
                <div className="adp-amenities-grid">
                  {amenities.map(a => {
                    const val = boolLabel(apartment[a.key]);
                    return (
                      <div key={a.key} className={`adp-amenity ${val ? 'yes' : 'no'}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="adp-amenity-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                          {a.icon}
                        </span>
                        {a.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rental conditions  */}
            {(conditions.length > 0 || apartment.rental_min_duration) && (
              <div className="adp-section">
                <div className="adp-section-title">Conditions de location</div>
                <div className="adp-conditions-grid">
                  {apartment.rental_min_duration && (
                    <div className="adp-detail-item">
                      <span className="adp-detail-label">Durée minimale</span>
                      <span className="adp-detail-value">
                        {apartment.rental_min_duration} {apartment.rental_duration_unit || 'mois'}
                      </span>
                    </div>
                  )}
                  {conditions.map(c => {
                    const val = boolLabel(apartment[c.key]);
                    return (
                      <div key={c.key} className={`adp-amenity ${val ? 'yes' : 'no'}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="adp-amenity-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                          {c.icon}
                        </span>
                        {c.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tenant profile */}
            {profilTags.length > 0 && (
              <div className="adp-section">
                <div className="adp-section-title">Profil locataire souhaité</div>
                <div className="adp-tags">
                  {profilTags.map((tag, i) => (
                    <span key={i} className="adp-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* sidebar */}
          <div className="adp-sidebar">
            {/* Price card */}
            <div className="adp-price-card">
              <div className={`adp-status-badge ${apartment.status === 'Rejetée' ? 'rejected' : apartment.status === 'En Attente' ? 'pending' : 'accepted'}`}>
                <span className="adp-status-dot" />
                {apartment.status === 'Acceptée' ? 'A louer' : apartment.status === 'En Attente' ? 'En Attente' : 'Rejetée'}
              </div>

              <h1 className="adp-title">{apartment.title || 'Titre non disponible'}</h1>

              <div className="adp-location" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaMapMarkerAlt size={14} />
                {[apartment.address].filter(Boolean).join(', ') || 'Adresse non précisée'}
              </div>

              <div className="adp-price-row">
                <div>
                  <div style={{display:'flex',alignItems:'baseline',gap:6}}>
                    <span className="adp-price-amount">
                      {apartment.monthly_price ? Number(apartment.monthly_price).toLocaleString('fr-MA') : '—'}
                    </span>
                    <span className="adp-price-unit">MAD / mois</span>
                  </div>
                </div>
              </div>

              <div className="adp-cta-group">
                {user?.role === 'Client' && (
                  <>
                    <button className="adp-btn-primary" onClick={() => navigate(`/feedback/${id}`)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <FaPen size={12} /> Donner un feedback
                    </button>
                    <button className="adp-btn-secondary" onClick={() => navigate(`/demande/${id}`)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <FaPhoneAlt size={12} /> Contacter le propriétaire
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Quick stats */}
            <div className="adp-quick-stats">
              <div className="adp-stat">
                <div className="adp-stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaBed size={18} /></div>
                <div>
                  <div className="adp-stat-label">Chambres</div>
                  <div className="adp-stat-value">{apartment.number_rooms ?? '—'}</div>
                </div>
              </div>
              <div className="adp-stat">
                <div className="adp-stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaBath size={18} /></div>
                <div>
                  <div className="adp-stat-label">Salles de bain</div>
                  <div className="adp-stat-value">{apartment.number_bathrooms ?? '—'}</div>
                </div>
              </div>
              <div className="adp-stat">
                <div className="adp-stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaSquare size={16} /></div>
                <div>
                  <div className="adp-stat-label">Surface</div>
                  <div className="adp-stat-value">{apartment.surface ? `${apartment.surface} m²` : '—'}</div>
                </div>
              </div>
              <div className="adp-stat">
                <div className="adp-stat-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaArrowUp size={18} /></div>
                <div>
                  <div className="adp-stat-label">Étage</div>
                  <div className="adp-stat-value">{apartment.floor ?? '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback  */}
        <div className="adp-feedback-section">
          <FeedbackList key={feedbackRefresh} apartmentId={id} />
        </div>
      </div>
    </>
  );
};

export default ApartmentDetailPage;