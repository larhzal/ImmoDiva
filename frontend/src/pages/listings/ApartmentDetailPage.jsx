import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FeedbackList from '../../components/feedback/FeedbackList';
import '../../styles/pages/ApartmentDetails.css'
import Navbar from '../../components/layout/Navbar';

const IconLocation = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconBed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
  </svg>
);
const IconArea = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
  </svg>
);
const IconFloor = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/><path d="M5 21H19"/>
  </svg>
);
const IconBath = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/>
  </svg>
);

const ApartmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [feedbackRefresh, setFeedbackRefresh] = useState(0);

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

  useEffect(() => { if (id) fetchApartmentDetails(); }, [id, fetchApartmentDetails]);

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
    { key: 'elevator',   label: 'Ascenseur',  icon: '🛗' },
    { key: 'parking',    label: 'Parking',    icon: '🚗' },
    { key: 'furnitured', label: 'Meublé',     icon: '🛋️' },
    { key: 'pool',       label: 'Piscine',    icon: '🏊' },
    { key: 'balcony',    label: 'Balcon',     icon: '🌿' },
    { key: 'concierge',  label: 'Gardien',    icon: '👮' },
  ].filter(a => boolLabel(apartment[a.key]) !== null) : [];

  const conditions = apartment ? [
    { key: 'animals_accepted',   label: 'Animaux acceptés', icon: '🐾' },
    { key: 'smokers_accepted',   label: 'Fumeurs acceptés', icon: '🚬' },
    { key: 'rommates_accepted',  label: 'Colocataires',     icon: '👥' },
    { key: 'charges_included',   label: 'Charges incluses', icon: '💡' },
  ].filter(c => boolLabel(apartment[c.key]) !== null) : [];

  if (loading) return (
    <>
      <div className="adp-state">
        <div className="adp-spinner" />
        <p>Chargement de l'annonce…</p>
      </div>
    </>
  );

  if (error) return (
    <>
      <div className="adp-state">
        <div className="adp-state-icon">😕</div>
        <h2>Une erreur est survenue</h2>
        <p>{error}</p>
        <button className="adp-btn-primary" style={{marginTop:8,borderRadius:10,border:'none',cursor:'pointer',padding:'12px 24px',fontFamily:'DM Sans,sans-serif',fontSize:14,fontWeight:600,background:'#E8A020',color:'#fff'}} onClick={fetchApartmentDetails}>Réessayer</button>
        <button className="adp-btn-secondary" style={{borderRadius:10,border:'1.5px solid #EFEFEF',cursor:'pointer',padding:'11px 24px',fontFamily:'DM Sans,sans-serif',fontSize:14,fontWeight:500,background:'#fff',color:'#1A1A2E'}} onClick={() => navigate('/listings')}>Retour aux annonces</button>
      </div>
    </>
  );

  if (!apartment) return (
    <>
      <div className="adp-state">
        <div className="adp-state-icon">🏚️</div>
        <h2>Appartement introuvable</h2>
        <button className="adp-btn-secondary" onClick={() => navigate('/listings')}>Retour aux annonces</button>
      </div>
    </>
  );

  const isApproved = apartment.status === 'approved' || apartment.status === 'Approuvée';
  const profilTags = Array.isArray(apartment.roomer_profil_desired) ? apartment.roomer_profil_desired : [];

  return (
    <>
      <Navbar/>
      <div className="adp-page">
        {/* Top bar */}
        <div className="adp-topbar">
          <button className="adp-back-btn" onClick={() => navigate('/listings')}>
            <span className="adp-back-arrow">←</span> Retour aux annonces
          </button>
          <div className="adp-breadcrumb">
            / <span>{apartment.title || 'Appartement'}</span>
          </div>
        </div>

        {/* Main 2-col grid */}
        <div className="adp-container">
          {/* LEFT — gallery + details */}
          <div className="adp-content">
            {/* Gallery */}
            <div className="adp-gallery">
              <div className="adp-main-img-wrap">
                <img src={currentImage} alt={apartment.title || 'Appartement'} className="adp-main-img" />
                {pictures.length > 1 && (
                  <>
                    <button className="adp-nav-btn adp-prev" onClick={handlePrev}>‹</button>
                    <button className="adp-nav-btn adp-next" onClick={handleNext}>›</button>
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
                        <span className="adp-detail-value">{Boolean(apartment.deposit_required)? "Oui" : "Non"}</span>
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

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="adp-section">
                <div className="adp-section-title">Équipements</div>
                <div className="adp-amenities-grid">
                  {amenities.map(a => {
                    const val = boolLabel(apartment[a.key]);
                    return (
                      <div key={a.key} className={`adp-amenity ${val ? 'yes' : 'no'}`}>
                        <span className="adp-amenity-icon">{a.icon}</span>
                        {a.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rental conditions */}
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
                      <div key={c.key} className={`adp-amenity ${val ? 'yes' : 'no'}`}>
                        <span className="adp-amenity-icon">{c.icon}</span>
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

          {/* RIGHT — sidebar */}
          <div className="adp-sidebar">
            {/* Price card */}
            <div className="adp-price-card">
              <div className={`adp-status-badge ${isApproved ? 'approved' : 'pending'}`}>
                <span className="adp-status-dot" />
                {isApproved ? 'Acceptée' : 'En attente'}
              </div>

              <h1 className="adp-title">{apartment.title || 'Titre non disponible'}</h1>

              <div className="adp-location">
                <IconLocation />
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
                <button className="adp-btn-primary" onClick={() => navigate(`/feedback/${id}`)}>
                  ✍️ Donner un feedback
                </button>
                  <button className="adp-btn-secondary" onClick={() => navigate(`/demande/${id}`)}>
                  📞 Contacter le propriétaire
                </button>
              </div>
            </div>

            {/* Quick stats */}
            <div className="adp-quick-stats">
              <div className="adp-stat">
                <div className="adp-stat-icon"><IconBed /></div>
                <div>
                  <div className="adp-stat-label">Chambres</div>
                  <div className="adp-stat-value">{apartment.number_rooms ?? '—'}</div>
                </div>
              </div>
              <div className="adp-stat">
                <div className="adp-stat-icon"><IconBath /></div>
                <div>
                  <div className="adp-stat-label">Salles de bain</div>
                  <div className="adp-stat-value">{apartment.number_bathrooms ?? '—'}</div>
                </div>
              </div>
              <div className="adp-stat">
                <div className="adp-stat-icon"><IconArea /></div>
                <div>
                  <div className="adp-stat-label">Surface</div>
                  <div className="adp-stat-value">{apartment.surface ? `${apartment.surface} m²` : '—'}</div>
                </div>
              </div>
              <div className="adp-stat">
                <div className="adp-stat-icon"><IconFloor /></div>
                <div>
                  <div className="adp-stat-label">Étage</div>
                  <div className="adp-stat-value">{apartment.floor ?? '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback — full width */}
        <div className="adp-feedback-section">
          <FeedbackList key={feedbackRefresh} apartmentId={id} />
        </div>
      </div>
    </>
  );
};

export default ApartmentDetailPage;