const supabase = require('../../config/db');

class FeedbackService {
    // Créer un feedback
    async createFeedback(apartmentId, userId, feedbackData) {
        const { rating, title, comment } = feedbackData;

        const { data, error } = await supabase
            .from('Feedback')
            .insert([
                {
                    apartment_id: apartmentId,
                    user_id: userId,
                    rating,
                    title,
                    comment,
                    created_at: new Date().toISOString(),
                }
            ])
            .select();

        if (error) throw error;
        return data[0];
    }

    // Récupérer tous les feedbacks d'un appartement
    async getFeedbacksByApartment(apartmentId) {
        const { data, error } = await supabase
            .from('Feedback')
            .select('*,User(id,name,email)')
            .eq('apartment_id', apartmentId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    // Récupérer un feedback par ID
    async getFeedbackById(feedbackId) {
        const { data, error } = await supabase
            .from('Feedback')
            .select('*,User(id,name,email)')
            .eq('id', feedbackId)
            .single();

        if (error) throw error;
        return data;
    }

    // Supprimer un feedback
    async deleteFeedback(feedbackId) {
        const { error } = await supabase
            .from('Feedback')
            .delete()
            .eq('id', feedbackId);

        if (error) throw error;
        return true;
    }

    // Calculer la note moyenne d'un appartement
    async getAverageRating(apartmentId) {
        const { data, error } = await supabase
            .from('Feedback')
            .select('rating')
            .eq('apartment_id', apartmentId);

        if (error) throw error;
        
        if (data.length === 0) return 0;
        
        const sum = data.reduce((acc, feedback) => acc + feedback.rating, 0);
        return (sum / data.length).toFixed(1);
    }
}

module.exports = new FeedbackService();
