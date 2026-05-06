const express = require('express');
const router = express.Router();
const rentalsController = require('./rentals.controller');
const roleMiddleware = require('../../middleware/role.middleware');
const authMiddleware = require('../../middleware/auth.middleware');

// Envoyer une demande de location
// pour tester decommenter la ligne 9 et commenter les ligne 11,12,13 et 14
router.post('/', rentalsController.creerDemande);
router.patch('/:id/accept', rentalsController.accepterDemande);
router.patch('/:id/refuse', rentalsController.refuserDemande);
router.get('/received', rentalsController.getDemandesRecues);
// router.get(
//   '/received',
//   authMiddleware,
//   roleMiddleware('publisher'),
//   rentalsController.getDemandesRecues
// )

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
