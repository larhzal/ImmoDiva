const express        = require('express')
const router         = express.Router()
const rentalsController = require('./rentals.controller')
const roleMiddleware = require('../../middleware/role.middleware')
const authMiddleware = require('../../middleware/auth.middleware')

// Envoyer une demande de location
router.post(
  '/',authMiddleware,roleMiddleware('Client'),
  rentalsController.creerDemande
)
module.exports = router