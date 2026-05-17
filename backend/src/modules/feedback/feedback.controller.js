const feedbackService = require('./feedback.service');
const {supabase} = require('../../config/db');

class FeedbackController {

    // ─── Vérifier si un user a une demande acceptée pour un appartement ───
    async checkEligibility(req, res) {
        try {
            const { apartmentId } = req.params;
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({ eligible: false, error: 'userId requis.' });
            }

            const { data, error } = await supabase
                .from('sent_request')
                .select('id')
                .eq('apartment_id', apartmentId)
                .eq('client_id', userId)
                .eq('response', 'accepted')
                .maybeSingle();

            if (error) throw error;

            return res.json({ eligible: !!data });
        } catch (err) {
            console.error('Erreur vérification éligibilité:', err);
            res.status(500).json({ eligible: false, error: err.message });
        }
    }

    // ─── Créer un nouveau feedback ───
    async createFeedback(req, res) {
        try {
            const { apartmentId } = req.params;
            const { userId, content } = req.body;
                console.log(req.body)

            if (!content) {
                return res.status(400).json({ error: 'Le contenu du feedback est obligatoire.' });
            }

            if (!userId) {
                return res.status(401).json({ error: 'Vous devez être connecté pour laisser un feedback.' });
            }

            // ── Vérifier que le user a une demande acceptée pour cet appartement ──
            const { data: request, error: reqError } = await supabase
                .from('sent_request')
                .select('id')
                .eq('apartment_id', apartmentId)
                .eq('client_id', userId)
                .eq('response', 'accepted')
                .maybeSingle();

            if (reqError) throw reqError;

            if (!request) {
                return res.status(403).json({
                    error: 'Seul un locataire ayant loué cet appartement peut laisser un feedback.'
                });
            }

            const feedback = await feedbackService.createFeedback(apartmentId, userId, content);
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

    // Récupérer la note moyenne
    async getAverageRating(req, res) {
        try {
            const { apartmentId } = req.params;
            const feedbacks = await feedbackService.getFeedbacksByApartment(apartmentId);
            const ratings = feedbacks
                .map((f) => Number(f.rating))
                .filter((v) => !Number.isNaN(v));
            const averageRating = ratings.length
                ? (ratings.reduce((a, v) => a + v, 0) / ratings.length).toFixed(1)
                : 0;
            res.json({ apartmentId, averageRating, totalReviews: feedbacks.length });
        } catch (err) {
            console.error('Erreur note moyenne:', err);
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new FeedbackController();