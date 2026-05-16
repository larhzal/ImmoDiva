const express        = require('express')
const router         = express.Router()
const rentalsController = require('./rentals.controller')
const roleMiddleware = require('../../middleware/role.middleware')
const authMiddleware = require('../../middleware/auth.middleware')

// Envoyer une demande de location
// pour tester decommenter la ligne 9 et commenter les ligne 11,12,13 et 14
router.post('/',authMiddleware,rentalsController.creerDemande)

// router.post(
//   '/',authMiddleware,roleMiddleware('Client'),
//   rentalsController.creerDemande
// )
module.exports = router