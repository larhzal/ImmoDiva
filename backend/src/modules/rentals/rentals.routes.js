const express = require('express');
const router = express.Router();
const rentalsController = require('./rentals.controller');
const roleMiddleware = require('../../middleware/role.middleware');
const authMiddleware = require('../../middleware/auth.middleware');
const { auth } = require('../../config/db');

// Envoyer une demande de location
// pour tester decommenter la ligne 9 et commenter les ligne 11,12,13 et 14
// router.post('/', rentalsController.creerDemande);
// router.patch('/:id/accept', rentalsController.accept_request);
// router.patch('/:id/refuse', rentalsController.reject_request);
// router.get('/received', rentalsController.getDemandesRecues);
// router.get('/:id', rentalsController.getDemandeById)

router.get('/:id', authMiddleware, rentalsController.getDemandeById)
router.get(
  '/received',
  authMiddleware,
  roleMiddleware('publisher'),
  rentalsController.getDemandesRecues
)
router.patch('/:id/accept',authMiddleware,roleMiddleware('publisher'), rentalsController.accept_request);
router.patch('/:id/refuse',authMiddleware,roleMiddleware('publisher'), rentalsController.reject_request);

// router.patch(
//   '/:id/response',
//   authMiddleware,
//   roleMiddleware('publisher'),
//   rentalsController.repondreDemande
// )

router.post(
  '/',authMiddleware,roleMiddleware('Client'),
  rentalsController.creerDemande
)
module.exports = router;
