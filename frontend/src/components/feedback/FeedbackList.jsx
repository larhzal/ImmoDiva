import React, { useState, useEffect } from 'react';
import '../../styles/components/feedback.css';

const FeedbackList = ({ apartmentId }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    useEffect(() => {
        fetchFeedbacks();
        fetchAverageRating();
    }, [apartmentId]);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/annonces/${apartmentId}/feedback`
            );

            if (!response.ok) {
                throw new Error('Erreur lors du chargement des avis');
            }

            const data = await response.json();
            setFeedbacks(data || []);
        } catch (err) {
            setError(err.message);
            setFeedbacks([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAverageRating = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/annonces/${apartmentId}/feedback/rating`
            );

            if (!response.ok) {
                throw new Error('Erreur lors du chargement de la note moyenne');
            }

            const data = await response.json();
            setAverageRating(data.averageRating || 0);
            setTotalReviews(data.totalReviews || 0);
        } catch (err) {
            console.error(err);
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="stars-display">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= rating ? 'filled' : 'empty'}`}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    if (loading) {
        return <div className="loading">Chargement des avis...</div>;
    }

    return (
        <div className="feedback-list-container">
            {/* Rating Summary */}
            <div className="rating-summary">
                <div className="rating-header">
                    <h3>Avis des clients</h3>
                </div>
                {totalReviews > 0 ? (
                    <div className="rating-info">
                        <div className="overall-rating">
                            <div className="rating-number">{averageRating}</div>
                            <div className="rating-stars">
                                {renderStars(Math.round(averageRating))}
                            </div>
                            <div className="rating-count">Basé sur {totalReviews} avis</div>
                        </div>
                    </div>
                ) : (
                    <p className="no-reviews">Aucun avis pour le moment</p>
                )}
            </div>

            {/* Feedbacks List */}
            {feedbacks.length > 0 && (
                <div className="feedbacks">
                    {feedbacks.map((feedback) => (
                        <div key={feedback.id} className="feedback-card">
                            <div className="feedback-header">
                                <div className="feedback-user-info">
                                    <h4 className="feedback-title">{feedback.title}</h4>
                                    <p className="feedback-author">
                                        {feedback.User?.name || 'Utilisateur anonyme'}
                                    </p>
                                </div>
                                <div className="feedback-rating">
                                    {renderStars(feedback.rating)}
                                </div>
                            </div>
                            <p className="feedback-comment">{feedback.comment}</p>
                            <p className="feedback-date">{formatDate(feedback.created_at)}</p>
                        </div>
                    ))}
                </div>
            )}

            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default FeedbackList;
