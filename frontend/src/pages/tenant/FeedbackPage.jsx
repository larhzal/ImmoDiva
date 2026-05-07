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

    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    const userId = storedUser?.id || null;
    const userName = storedUser?.name || 'Utilisateur';

    const handleFeedbackSubmitted = () => {
        setSubmitted(true);
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-container">
                    <p>Chargement de la page de feedback...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="error-container">
                    <p className="error-message">Oups 🙄, {error}</p>
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="detail-header">
                <button className="back-btn" onClick={() => navigate(`/apartment/${id}`)}>
                    ← Retour à l'appartement
                </button>
            </div>

            <div className="apartment-detail">
                <div className="detail-content">
                    <div className="detail-header-info">
                        <h1 className="apartment-title">Donner un feedback</h1>
                        <div className="price-tag">
                            <span className="price">{apartment.monthly_price || 'Prix non précisé'} MAD</span>
                        </div>
                    </div>

                    <div className="apartment-info-grid">
                        <div className="info-item">
                            <strong>Appartement :</strong>
                            <span>{apartment.title || 'Titre non disponible'}</span>
                        </div>
                        <div className="info-item">
                            <strong>Ville :</strong>
                            <span>{apartment.city || 'Ville non précisée'}</span>
                        </div>
                        <div className="info-item">
                            <strong>Chambres :</strong>
                            <span>{apartment.number_rooms || 'N/A'}</span>
                        </div>
                        {apartment.description && (
                            <div className="description-section">
                                <h3>Description</h3>
                                <p className="description">{apartment.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {submitted ? (
                <div className="success-container">
                    <p>Merci ! Votre feedback a bien été envoyé.</p>
                    <button className="submit-btn" onClick={() => navigate(`/apartment/${id}`)}>
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

            <FeedbackList apartmentId={id} />
        </div>
    );
};

export default FeedbackPage;
