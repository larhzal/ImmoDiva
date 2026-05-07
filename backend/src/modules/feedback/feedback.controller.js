const feedbackService = require('./feedback.service');

class FeedbackController {
    // Créer un nouveau feedback
    async createFeedback(req, res) {
        try {
            const { apartmentId } = req.params;
            const { userId, content } = req.body;

            // Validation
            if (!content) {
                return res.status(400).json({
                    error: 'Le contenu du feedback est obligatoire.'
                });
            }

            const feedback = await feedbackService.createFeedback(
                apartmentId,
                userId,
                content
            );

            res.status(201).json(feedback);
        } catch (err) {
            console.error('Erreur création feedback:', err);
            res.status(500).json({ error: err.message });
        }
    }

    // Récupérer les feedbacks d'un appartement
    async getFeedbacksByApartment(req, res) {
        try {
            const { apartmentId } = req.params;

            const feedbacks = await feedbackService.getFeedbacksByApartment(apartmentId);

            res.json(feedbacks);
        } catch (err) {
            console.error('Erreur récupération feedbacks:', err);
            res.status(500).json({ error: err.message });
        }
    }

    // Supprimer un feedback
    async deleteFeedback(req, res) {
        try {
            const { feedbackId } = req.params;

            await feedbackService.deleteFeedback(feedbackId);

            res.json({ message: 'Feedback supprimé avec succès' });
        } catch (err) {
            console.error('Erreur suppression feedback:', err);
            res.status(500).json({ error: err.message });
        }
    }

    // Récupérer la note moyenne d'un appartement
    async getAverageRating(req, res) {
        try {
            const { apartmentId } = req.params;
            const feedbacks = await feedbackService.getFeedbacksByApartment(apartmentId);
            const ratings = feedbacks
                .map((f) => Number(f.rating))
                .filter((value) => !Number.isNaN(value));
            const averageRating = ratings.length
                ? (ratings.reduce((acc, value) => acc + value, 0) / ratings.length).toFixed(1)
                : 0;
            res.json({ apartmentId, averageRating, totalReviews: feedbacks.length });
        } catch (err) {
            console.error('Erreur récupération note moyenne:', err);
            res.status(500).json({ error: err.message });
        }
    }

    // Méthode helper pour compter les avis
    async getTotalReviews(apartmentId) {
        const feedbacks = await feedbackService.getFeedbacksByApartment(apartmentId);
        return feedbacks.length;
    }
}

module.exports = new FeedbackController();
