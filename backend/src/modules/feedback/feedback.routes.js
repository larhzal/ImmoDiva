const express = require('express');
const router = express.Router();
const feedbackController = require('./feedback.controller');

// Créer un feedback pour un appartement
router.post('/:apartmentId/feedback', feedbackController.createFeedback.bind(feedbackController));

// Récupérer les feedbacks d'un appartement
router.get('/:apartmentId/feedback', feedbackController.getFeedbacksByApartment.bind(feedbackController));

// Supprimer un feedback
router.delete('/:feedbackId/feedback', feedbackController.deleteFeedback.bind(feedbackController));

// Récupérer la note moyenne d'un appartement
router.get('/:apartmentId/feedback/rating', feedbackController.getAverageRating.bind(feedbackController));

module.exports = router;
