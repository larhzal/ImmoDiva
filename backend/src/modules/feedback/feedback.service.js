const {supabase }= require('../../config/db');

class FeedbackService {
    // Créer un feedback
    async createFeedback(apartmentId, userId, content) {
        const { data, error } = await supabase
            .from('Feedback')
            .insert([
                {
                    apartment_id: apartmentId,
                    feedback_writer: userId || null,
                    content,
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
            .select(`
                *,
                User!feedback_writer(
                    id,
                    username
                )
            `)
            .eq('apartment_id', apartmentId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    // Récupérer un feedback par ID
    async getFeedbackById(feedbackId) {
        const { data, error } = await supabase
            .from('Feedback')
            .select(`
                *,
                User!feedback_writer(
                    id,
                    username
                )
            `)
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

    // Calculer la note moyenne d'un appartement (supporte les feedbacks sans note)
    async getAverageRating(apartmentId) {
        const { data, error } = await supabase
            .from('Feedback')
            .select()
            .eq('apartment_id', apartmentId);

        if (error) throw error;
        
        const ratings = data
            .map((feedback) => Number(feedback.rating))
            .filter((rating) => !Number.isNaN(rating));

        if (ratings.length === 0) return 0;
        
        const sum = ratings.reduce((acc, rating) => acc + rating, 0);
        return (sum / ratings.length).toFixed(1);
    }
}

module.exports = new FeedbackService();
