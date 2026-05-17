import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FeedbackForm from '../../components/feedback/FeedbackForm';
import FeedbackList from '../../components/feedback/FeedbackList';
import '../../styles/pages/listings.css';

const FeedbackPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [apartment, setApartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false);

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
            console.error(err);
            setError(err.message || 'Erreur de chargement');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchApartmentDetails();
        }
    }, [id, fetchApartmentDetails]);

    const storedUser = JSON.parse(localStorage.getItem('immodiva_user') || 'null');
    const userId = storedUser?.id || null;
    const userName = storedUser?.username || 'Utilisateur';

    const handleFeedbackSubmitted = () => {
        setSubmitted(true);
    };

    if (loading) {
        return (
            <div className="adp-state">
                <div className="adp-spinner"></div>
                <p>Chargement de la page de feedback...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="adp-state">
                <div className="adp-state-icon">🙄</div>
                <h2>Oups !</h2>
                <p>{error}</p>
                <button className="adp-back-btn" onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
                    <span className="adp-back-arrow">←</span> Retour
                </button>
            </div>
        );
    }

    return (
        <div className="adp-page">
            <div className="adp-topbar">
                <button className="adp-back-btn" onClick={() => navigate(`/apartment/${id}`)}>
                    <span className="adp-back-arrow">←</span>
                    <span>Retour à l'appartement</span>
                </button>
                <div className="adp-breadcrumb">
                    Détails / <span>Feedback</span>
                </div>
            </div>

            <div className="adp-container">
                {/* Main Content Area */}
                <div className="adp-content">
                    <div className="adp-section">
                        <h1 className="adp-title">Donner un feedback</h1>
                        <p className="adp-location" style={{ marginBottom: '24px' }}>
                            {apartment.title || 'Titre non disponible'} — {apartment.city || 'Ville non précisée'}
                        </p>

                        <div className="adp-details-grid">
                            <div className="adp-detail-item">
                                <span className="adp-detail-label">Prix Mensuel</span>
                                <span className="adp-detail-value">{apartment.monthly_price || 'Prix non précisé'} MAD</span>
                            </div>
                            <div className="adp-detail-item">
                                <span className="adp-detail-label">Chambres</span>
                                <span className="adp-detail-value">{apartment.number_rooms || 'N/A'}</span>
                            </div>
                            <div className="adp-detail-item">
                                <span className="adp-detail-label">Statut</span>
                                <span className="adp-detail-value">Prêt pour Feedback</span>
                            </div>
                        </div>

                        {apartment.description && (
                            <div style={{ marginTop: '24px' }}>
                                <h3 className="adp-section-title">Description</h3>
                                <p className="adp-description">{apartment.description}</p>
                            </div>
                        )}
                    </div>

                    {submitted ? (
                        <div className="adp-section" style={{ textAlign: 'center', border: '2px solid var(--green)' }}>
                            <div className="adp-status-badge approved">
                                <span className="adp-status-dot"></span> Succès
                            </div>
                            <h2 className="adp-title" style={{ marginTop: '16px' }}>Merci !</h2>
                            <p className="adp-description">Votre feedback a bien été envoyé.</p>
                            <button 
                                className="adp-btn-primary" 
                                onClick={() => navigate(`/apartment/${id}`)}
                                style={{ marginTop: '24px', display: 'inline-block' }}
                            >
                                Retour à l'appartement
                            </button>
                        </div>
                    ) : (
                        <FeedbackForm
                            apartmentId={id}
                            userId={userId}
                            userName={userName}
                            onFeedbackSubmitted={handleFeedbackSubmitted}
                        />
                    )}
                </div>

                {/* Sidebar area for the Feedback List summary */}
                {/* <div className="adp-sidebar">
                    <FeedbackList apartmentId={id} />
                </div> */}
            </div>
        </div>
    );
};

export default FeedbackPage;