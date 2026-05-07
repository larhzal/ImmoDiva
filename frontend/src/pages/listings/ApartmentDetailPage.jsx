import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FeedbackForm from '../../components/feedback/FeedbackForm';
import FeedbackList from '../../components/feedback/FeedbackList';
import '../../styles/pages/listings.css';

const ApartmentDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [apartment, setApartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [feedbackRefresh, setFeedbackRefresh] = useState(0);

    const fetchApartmentDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/api/annonces/${id}`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Appartement non trouvé');
                }
                throw new Error('Erreur lors de la récupération des détails');
            }

            const data = await response.json();
            setApartment(data);
        } catch (err) {
            console.error('Erreur Fetch:', err);
            setError(err.message || 'Erreur lors du chargement des détails');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchApartmentDetails();
        }
    }, [id, fetchApartmentDetails]);

    const handlePrevImage = () => {
        if (apartment?.Pictures?.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? apartment.Pictures.length - 1 : prev - 1
            );
        }
    };

    const handleNextImage = () => {
        if (apartment?.Pictures?.length > 1) {
            setCurrentImageIndex((prev) =>
                prev === apartment.Pictures.length - 1 ? 0 : prev + 1
            );
        }
    };

    const handleFeedbackSubmitted = (newFeedback) => {
        setShowFeedbackForm(false);
        setFeedbackRefresh((prev) => prev + 1);
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-container">
                    <p>Chargement des détails de l'appartement...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="error-container">
                    <p className="error-message">Erreur : {error}</p>
                    <button className="retry-btn" onClick={() => navigate('/listings')}>
                        Retour aux annonces
                    </button>
                </div>
            </div>
        );
    }

    if (!apartment) {
        return (
            <div className="page-container">
                <div className="error-container">
                    <p className="error-message">Appartement non trouvé</p>
                    <button className="retry-btn" onClick={() => navigate('/listings')}>
                        Retour aux annonces
                    </button>
                </div>
            </div>
        );
    }

    const pictures = apartment.Pictures || [];
    const currentImage = pictures.length > 0 ? pictures[currentImageIndex].url :
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';

    return (
        <div className="page-container">
            {/* Header avec bouton retour */}
            <div className="detail-header">
                <button className="back-btn" onClick={() => navigate('/listings')}>
                    ← Retour aux annonces
                </button>
            </div>

            {/* Section principale */}
            <div className="apartment-detail">
                {/* Galerie d'images */}
                <div className="image-gallery">
                    <div className="main-image-container">
                        <img
                            src={currentImage}
                            alt={apartment.title || 'Appartement'}
                            className="main-image"
                        />
                        {pictures.length > 1 && (
                            <>
                                <button className="nav-btn prev-btn" onClick={handlePrevImage}>
                                    ‹
                                </button>
                                <button className="nav-btn next-btn" onClick={handleNextImage}>
                                    ›
                                </button>
                            </>
                        )}
                    </div>
                    {pictures.length > 1 && (
                        <div className="thumbnail-container">
                            {pictures.map((pic, index) => (
                                <img
                                    key={pic.id}
                                    src={pic.url}
                                    alt={`Vue ${index + 1}`}
                                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Informations détaillées */}
                <div className="detail-content">
                    <div className="detail-header-info">
                        <h1 className="apartment-title">{apartment.title || 'Titre non disponible'}</h1>
                        <div className="price-tag">
                            <span className="price">{apartment.monthly_price || 'Prix non précisé'} MAD</span>
                            <span className="price-period">/ mois</span>
                        </div>
                    </div>

                    <div className="apartment-info-grid">
                        <div className="info-item">
                            <svg className="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <div className="info-content">
                                <span className="info-label">Ville</span>
                                <span className="info-value">{apartment.city || 'Ville non précisée'}</span>
                            </div>
                        </div>

                        <div className="info-item">
                            <svg className="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 4v16"/>
                                <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
                                <path d="M2 17h20"/>
                                <path d="M6 8v9"/>
                            </svg>
                            <div className="info-content">
                                <span className="info-label">Chambres</span>
                                <span className="info-value">{apartment.number_rooms || 'N/A'} chambre(s)</span>
                            </div>
                        </div>

                        {apartment.description && (
                            <div className="description-section">
                                <h3>Description</h3>
                                <p className="description">{apartment.description}</p>
                            </div>
                        )}

                        {apartment.surface && (
                            <div className="info-item">
                                <svg className="info-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                </svg>
                                <div className="info-content">
                                    <span className="info-label">Surface</span>
                                    <span className="info-value">{apartment.surface} m²</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="action-buttons">
                        <button 
                            className="feedback-btn" 
                            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                        >
                            Donner un feedback
                        </button>
                        <button className="contact-btn">
                            Contacter le propriétaire
                        </button>
                    </div>
                </div>
            </div>

            {/* Feedback Form */}
            {showFeedbackForm && (
                <FeedbackForm 
                    apartmentId={id}
                    userId={1} // À remplacer par l'ID de l'utilisateur connecté
                    userName="Utilisateur" // À remplacer par le nom de l'utilisateur connecté
                    onFeedbackSubmitted={handleFeedbackSubmitted}
                />
            )}

            {/* Feedback List */}
            <FeedbackList key={feedbackRefresh} apartmentId={id} />
        </div>
    );
};

export default ApartmentDetailPage;
