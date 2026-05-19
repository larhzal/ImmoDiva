import React, { useState, useEffect } from 'react';
import '../../styles/pages/listings.css'; 

const ListingsPage = () => {
    const [annonces, setAnnonces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnnonces = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5000/api/annonces');
            
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des données.");
            }
            
            const data = await response.json();

            const annoncesFiltrees = data.filter(annonce => annonce.status === 'Acceptée');
            
            setAnnonces(annoncesFiltrees);
            // ----------------------------------------------------------

        } catch (err) {
            console.error("Erreur Fetch:", err);
            setError("Désolé, impossible de charger les annonces pour le moment. Notre serveur fait peut-être une petite pause. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnonces();
    }, []);

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
                    <label>Ville/ Région</label>
                    <select>
                        <option>Toutes les villes</option>
                        <option>Casablanca</option>
                        <option>Rabat</option>
                        <option>Marrakech</option>
                    </select>
                </div>
                <div className="search-field">
                    <label>Prix</label>
                    <select>
                        <option>Tous les prix</option>
                        <option>Moins de 3000 MAD</option>
                        <option>3000 - 6000 MAD</option>
                        <option>Plus de 6000 MAD</option>
                    </select>
                </div>
                <div className="search-field">
                    <label>Nombre de chambres</label>
                    <select>
                        <option>Peu importe</option>
                        <option>1 Chambre</option>
                        <option>2 Chambres</option>
                        <option>3+ Chambres</option>
                    </select>
                </div>
                <button className="search-btn">
                    🔍 Rechercher
                </button>
            </div>

            {/* --- MESSAGES D'ÉTAT --- */}
            {loading && (
                <div className="loading-container">
                    <p>Chargement des annonces en cours...</p>
                </div>
            )}

            {error && (
                <div className="error-container">
                    <p className="error-message">Oups, {error}</p>
                    <button className="retry-btn" onClick={fetchAnnonces}>
                        Réessayer
                    </button>
                </div>
            )}

            {/* --- AFFICHAGE DES ANNONCES --- */}
            {!loading && !error && annonces.length > 0 && (
                <div className="listings-grid">
                    {annonces.map((annonce) => {
                        
                        const imageAafficher = annonce.pictures && annonce.pictures.length > 0 
                            ? annonce.pictures[0].url 
                            : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";

                        return (
                            <div key={annonce.id} className="listing-card">
                                
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
                                        <svg className="listing-card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                                            <circle cx="12" cy="10" r="3"/>
                                        </svg>
                                        <span className="listing-card-text">
                                            {annonce.city || "Ville non précisée"}
                                        </span>
                                    </div>
                                    
                                    <div className="listing-card-info">
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