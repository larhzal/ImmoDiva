const express = require('express');
const router = express.Router();
const feedbackController = require('./feedback.controller');

// Vérifier si un user est éligible à laisser un feedback
router.get('/:apartmentId/feedback/eligibility', feedbackController.checkEligibility.bind(feedbackController));

// Créer un feedback (vérifie l'éligibilité en interne)
router.post('/:apartmentId/feedback', feedbackController.createFeedback.bind(feedbackController));

// Récupérer les feedbacks d'un appartement
router.get('/:apartmentId/feedback', feedbackController.getFeedbacksByApartment.bind(feedbackController));

// Supprimer un feedback
router.delete('/:feedbackId/feedback', feedbackController.deleteFeedback.bind(feedbackController));

// Note moyenne
router.get('/:apartmentId/feedback/rating', feedbackController.getAverageRating.bind(feedbackController));

module.exports = router;