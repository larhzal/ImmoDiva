const express = require('express');
const router = express.Router();
const rentalsController = require('./rentals.controller');
const roleMiddleware = require('../../middleware/role.middleware');
const authMiddleware = require('../../middleware/auth.middleware');
// const { auth } = require('../../config/db');

// Envoyer une demande de location
// pour tester decommenter la ligne 9 et commenter les ligne 11,12,13 et 14
router.post('/', rentalsController.creerDemande);

router.get(
  '/received',
  authMiddleware,roleMiddleware('Publisher'),
  rentalsController.getDemandesRecues
)
router.get('/:id', authMiddleware,roleMiddleware('Publisher'), rentalsController.getDemandeById)
router.patch('/:id/accept',authMiddleware,roleMiddleware('Publisher'), rentalsController.accept_request);
router.patch('/:id/refuse',authMiddleware,roleMiddleware('Publisher'), rentalsController.reject_request);

// router.patch(
//   '/:id/response',
//   authMiddleware,
//   roleMiddleware('publisher'),
//   rentalsController.repondreDemande
// )

// router.post(
//   '/',authMiddleware,roleMiddleware('Client'),
//   rentalsController.creerDemande
// )
module.exports = router;
