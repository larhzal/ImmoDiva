import React, { useState, useEffect } from 'react';
import '../../styles/components/feedback.css';

const FeedbackList = ({ apartmentId }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFeedbacks();
    }, [apartmentId]);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            setError(null);
            // Updated to route matching your resource structure
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

    // ── Calculate dynamic metrics safely inside the rendering block ──
    const validRatings = feedbacks
        .map((feedback) => {
            const rawContent = feedback.content || "";
            const ratingMatch = rawContent.match(/Note\s*:\s*(\d+)\/5/i);
            return ratingMatch && ratingMatch[1] ? parseInt(ratingMatch[1], 10) : null;
        })
        .filter((rating) => rating !== null);

    const totalReviews = validRatings.length;
    const averageRating = totalReviews > 0 
        ? (validRatings.reduce((sum, current) => sum + current, 0) / totalReviews).toFixed(1) 
        : "0.0";

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
            {error && <div className="error-message">{error}</div>}

            {/* Rating Summary Section */}
            <div className="rating-summary">
                <div className="rating-header">
                    <h3>Avis des clients</h3>
                </div>
                {totalReviews > 0 ? (
                    <div className="rating-info">
                        <div className="overall-rating">
                            <div className="rating-number">{averageRating}</div>
                            <div className="rating-stars">
                                {renderStars(Math.round(parseFloat(averageRating)))}
                            </div>
                            <div className="rating-count">
                                Basé sur {totalReviews} {totalReviews > 1 ? 'avis' : 'avis'}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="no-reviews">Aucun avis pour le moment</p>
                )}
            </div>

            {/* Feedbacks List */}
            {feedbacks.length > 0 && (
                <div className="feedbacks">
                    {feedbacks.map((feedback) => {
                        const rawContent = feedback.content || "";
                        
                        // 1. Dynamic Header Title Evaluation
                        let displayTitle = 'Avis';
                        if (rawContent.includes('Good Feedback')) displayTitle = 'Excellent Avis';
                        
                        // 2. Extract rating dynamically (looks for "Note : X/5")
                        let extractedRating = undefined;
                        const ratingMatch = rawContent.match(/Note\s*:\s*(\d+)\/5/i);
                        if (ratingMatch && ratingMatch[1]) {
                            extractedRating = parseInt(ratingMatch[1], 10);
                        }

                        // 3. Robust clean-up sequence using targeted Regex
                        let displayComment = "";
                        const messageSegments = rawContent.match(/'([^']*)'/g);
                        
                        if (messageSegments) {
                            displayComment = messageSegments
                                .map(str => str.replace(/^'|'$/g, '')) 
                                .filter(text => {
                                    const cleanText = text.toLowerCase().trim();
                                    return (
                                        cleanText !== "" && 
                                        !cleanText.includes("good feedback") && 
                                        !cleanText.includes("note")
                                    );
                                })
                                .join('\n') 
                                .replace(/\\n/g, '\n')
                                .replace(/\\r/g, '')
                                .trim();
                        }

                        // Fallback processing pass
                        if (!displayComment) {
                            displayComment = rawContent
                                .replace(/Good Feedback/gi, '')
                                .replace(/Note\s*:\s*\d+\/5/gi, '')
                                .replace(/\\n/g, '\n')
                                .replace(/\\r/g, '')
                                .replace(/['`"\+]/g, '') 
                                .trim();
                        }

                        return (
                            <div key={feedback.id} className="feedback-card">
                                <div className="feedback-header">
                                    <div className="feedback-user-info">
                                        <h4 className="feedback-title">
                                            {displayTitle}
                                        </h4>
                                        <p className="feedback-author">
                                            {feedback.User?.username || 'Utilisateur anonyme'}
                                        </p>
                                    </div>
                                    {extractedRating !== undefined && (
                                        <div className="feedback-rating">
                                            {renderStars(extractedRating)}
                                        </div>
                                    )}
                                </div>
                                <p className="feedback-comment" style={{ whiteSpace: 'pre-line' }}>
                                    {displayComment || "Aucun commentaire textuel fourni."}
                                </p>
                                <p className="feedback-date">{formatDate(feedback.created_at)}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FeedbackList;