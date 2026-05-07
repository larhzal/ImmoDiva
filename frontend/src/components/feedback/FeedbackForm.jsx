import React, { useState } from 'react';
import '../../styles/components/feedback.css';

const FeedbackForm = ({ apartmentId, userId, userName, onFeedbackSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!title || !comment) {
            setError('Le titre et le commentaire sont obligatoires.');
            setLoading(false);
            return;
        }

        const content = [
            title,
            comment,
            rating ? `Note : ${rating}/5` : null,
        ]
            .filter(Boolean)
            .join('\n\n');

        try {
            const response = await fetch(`http://localhost:5000/api/annonces/${apartmentId}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...(userId ? { userId } : {}),
                    content,
                }),
            });

            const responseBody = await response.json();

            if (!response.ok) {
                throw new Error(responseBody.error || 'Erreur lors de la soumission du feedback');
            }

            const data = responseBody;
            setSuccess(true);
            setRating(0);
            setTitle('');
            setComment('');

            if (onFeedbackSubmitted) {
                onFeedbackSubmitted(data);
            }

            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message || 'Erreur lors de la soumission du feedback');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="feedback-form-container">
            <h3 className="feedback-form-title">Donner votre avis</h3>

            {error && <div className="feedback-error">{error}</div>}
            {success && <div className="feedback-success">Feedback envoyé avec succès ! Merci !</div>}

            <form onSubmit={handleSubmit} className="feedback-form">
                {/* Rating Stars */}
                <div className="form-group">
                    <label className="form-label">Note</label>
                    <div className="stars-container">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`star ${
                                    star <= (hoverRating || rating) ? 'active' : ''
                                }`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    {rating > 0 && <p className="rating-text">{rating} sur 5</p>}
                </div>

                {/* Title */}
                <div className="form-group">
                    <label htmlFor="title" className="form-label">
                        Titre du feedback
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Résumez votre expérience en quelques mots..."
                        className="form-input"
                        maxLength={100}
                    />
                </div>

                {/* Comment */}
                <div className="form-group">
                    <label htmlFor="comment" className="form-label">
                        Votre commentaire
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Décrivez votre expérience détaillée de l'appartement..."
                        className="form-textarea"
                        rows="5"
                        maxLength={500}
                    />
                    <p className="char-count">{comment.length}/500</p>
                </div>

                {/* Submit Button */}
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Envoi en cours...' : 'Envoyer mon avis'}
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;
