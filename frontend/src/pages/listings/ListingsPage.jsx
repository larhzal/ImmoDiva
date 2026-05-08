import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/listings.css';

const priceOptions = [
    { value: '', label: 'Tous les prix' },
    { value: 'below3000', label: 'Moins de 3000 MAD' },
    { value: '3000-6000', label: '3000 - 6000 MAD' },
    { value: 'above6000', label: 'Plus de 6000 MAD' },
];

const roomOptions = [
    { value: '', label: 'Peu importe' },
    { value: '1', label: '1 Chambre' },
    { value: '2', label: '2 Chambres' },
    { value: '3plus', label: '3+ Chambres' },
];

const cityOptions = [
    { value: '', label: 'Toutes les villes' },
    { value: 'Casablanca', label: 'Casablanca' },
    { value: 'Rabat', label: 'Rabat' },
    { value: 'Meknès', label: 'Meknès' },
];

const ListingsPage = () => {
    const navigate = useNavigate();
    const [annonces, setAnnonces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [city, setCity] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [rooms, setRooms] = useState('');

    const fetchAnnonces = async ({ city = '', priceRange = '', rooms = '' } = {}) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (city) params.append('city', city);
            if (priceRange) params.append('priceRange', priceRange);
            if (rooms) params.append('rooms', rooms);

            const url = `http://localhost:5000/api/annonces${params.toString() ? `?${params.toString()}` : ''}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données.');
            }

            const data = await response.json();
            setAnnonces(data);
        } catch (err) {
            console.error('Erreur Fetch:', err);
            setError('Désolé, impossible de charger les annonces pour le moment. Notre serveur fait peut-être une petite pause. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnonces();
    }, []);

    const handleSearch = () => {
        fetchAnnonces({ city, priceRange, rooms });
    };

    const handleReset = () => {
        setCity('');
        setPriceRange('');
        setRooms('');
        fetchAnnonces();
    };

    return (
        <div className="page-container">
            {/* --- SECTION HERO --- */}
            <section className="hero-section">
                <h1 className="hero-title">
                    “Trouvez l'appartement idéal au Maroc <br />
                    — vite, simplement, en toute confiance.”
                </h1>
                <p className="hero-subtitle">Votre prochain chez-vous, à portée de clic</p>
            </section>

            {/* --- BARRE DE RECHERCHE --- */}
            <div className="search-bar">
                <div className="search-field">
                    <label>Ville / Région</label>
                    <select value={city} onChange={(e) => setCity(e.target.value)}>
                        {cityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="search-field">
                    <label>Prix</label>
                    <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                        {priceOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="search-field">
                    <label>Nombre de chambres</label>
                    <select value={rooms} onChange={(e) => setRooms(e.target.value)}>
                        {roomOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="search-actions">
                    <button className="search-btn" onClick={handleSearch}>
                        🔍 Rechercher
                    </button>
                    <button className="reset-btn" onClick={handleReset}>
                        Réinitialiser
                    </button>
                </div>
            </div>

            {(city || priceRange || rooms) && (
                <div className="active-filters">
                    <strong>Filtres actifs :</strong>
                    <span>{city ? ` Ville: ${city}` : ''}</span>
                    <span>{priceRange ? ` Prix: ${priceOptions.find((p) => p.value === priceRange)?.label}` : ''}</span>
                    <span>{rooms ? ` Chambres: ${roomOptions.find((r) => r.value === rooms)?.label}` : ''}</span>
                </div>
            )}

            {/* --- MESSAGES D'ÉTAT --- */}
            {loading && (
                <div className="loading-container">
                    <p>Chargement des annonces en cours...</p>
                </div>
            )}

            {error && (
                <div className="error-container">
                    <p className="error-message">Oups 🙄, {error}</p>
                    <button className="retry-btn" onClick={() => fetchAnnonces({ city, priceRange, rooms })}>
                        Réessayer
                    </button>
                </div>
            )}

            {/* --- AFFICHAGE DES ANNONCES --- */}
            {!loading && !error && annonces.length > 0 && (
                <div className="listings-grid">
                    {annonces.map((annonce) => {
                        const listingId = annonce.id || annonce.ID || annonce.apartment_id || annonce.apartmentId;
                        const pictures = (annonce.pictures || annonce.Pictures || []).map((pic) => ({
                            ...pic,
                            url: pic.url || pic.file_path || pic.file_name || '',
                        }));
                        const imageAafficher = pictures.length > 0 && pictures[0].url
                            ? pictures[0].url
                            : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";

                        return (
                            <div key={listingId || annonce.title || annonce.city || Math.random()} className="listing-card">
                                
                                <img 
                                    src={imageAafficher} 
                                    alt={annonce.title || "Appartement"} 
                                    className="listing-card-image" 
                                />
                                
                                <div className="listing-card-content">
                                    <h3 className="listing-card-title">
                                        {annonce.title || "Titre indisponible"}
                                    </h3>
                                    
                                    <p className="listing-card-price">
                                        {annonce.monthly_price} MAD/ mois
                                    </p>
                                    
                                    <div className="listing-card-info">
                                        {/* Icône Localisation SVG directe */}
                                        <svg className="listing-card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                                            <circle cx="12" cy="10" r="3"/>
                                        </svg>
                                        <span className="listing-card-text">
                                            {annonce.city || "Ville non précisée"}
                                        </span>
                                    </div>
                                    
                                    <div className="listing-card-info">
                                        {/* Icône Lit SVG directe */}
                                        <svg className="listing-card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 4v16"/>
                                            <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
                                            <path d="M2 17h20"/>
                                            <path d="M6 8v9"/>
                                        </svg>
                                        <span className="listing-card-text">
                                            {annonce.number_rooms || "N/A"} Chambres
                                        </span>
                                    </div>
                                </div>
                                
                                {listingId ? (
                                    <button 
                                        className="detail-btn" 
                                        onClick={() => navigate(`/apartment/${listingId}`)}
                                    >
                                        Voir les détails
                                    </button>
                                ) : (
                                    <span className="detail-missing-id">Détail indisponible</span>
                                )}
                                
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && !error && annonces.length === 0 && (
                <div className="no-results">
                    <p>Aucune annonce n'est disponible pour le moment.</p>
                </div>
            )}
        </div>
    );
};

export default ListingsPage;