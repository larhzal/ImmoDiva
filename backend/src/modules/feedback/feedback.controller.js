const feedbackService = require('./feedback.service');

class FeedbackController {
    // Créer un nouveau feedback
    async createFeedback(req, res) {
        try {
            const { apartmentId } = req.params;
            const { userId } = req.body;
            const { rating, title, comment } = req.body;

            // Validation
            if (!userId || !rating || !title || !comment) {
                return res.status(400).json({
                    error: 'Tous les champs sont obligatoires (userId, rating, title, comment)'
                });
            }

            if (rating < 1 || rating > 5) {
                return res.status(400).json({
                    error: 'La note doit être entre 1 et 5'
                });
            }

            const feedback = await feedbackService.createFeedback(
                apartmentId,
                userId,
                { rating, title, comment }
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

            const averageRating = await feedbackService.getAverageRating(apartmentId);

            res.json({ apartmentId, averageRating, totalReviews: await this.getTotalReviews(apartmentId) });
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
