class FeedbackService {
    constructor() {
        this.apiUrl = 'http://localhost:5000/api/annonces';
    }

    // Créer un feedback
    async createFeedback(apartmentId, feedback) {
        try {
            const response = await fetch(`${this.apiUrl}/${apartmentId}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(feedback),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création du feedback');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur création feedback:', error);
            throw error;
        }
    }

    // Récupérer les feedbacks d'un appartement
    async getFeedbacks(apartmentId) {
        try {
            const response = await fetch(`${this.apiUrl}/${apartmentId}/feedback`);

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des feedbacks');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur récupération feedbacks:', error);
            throw error;
        }
    }

    // Supprimer un feedback
    async deleteFeedback(feedbackId) {
        try {
            const response = await fetch(`${this.apiUrl}/${feedbackId}/feedback`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression du feedback');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur suppression feedback:', error);
            throw error;
        }
    }

    // Récupérer la note moyenne d'un appartement
    async getAverageRating(apartmentId) {
        try {
            const response = await fetch(`${this.apiUrl}/${apartmentId}/feedback/rating`);

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération de la note moyenne');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur récupération note moyenne:', error);
            throw error;
        }
    }
}

export default new FeedbackService();
