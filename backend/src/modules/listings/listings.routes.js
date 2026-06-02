const express = require('express');
const router = express.Router();
const { getAllAnnonces, getAnnonce, getCities } = require('./listings.controller');
const roleMiddleware = require('../../middleware/role.middleware')
// IMPORTANT : /cities doit être AVANT /:id
// sinon Express interpréterait "cities" comme un id

router.get('/cities', getCities);       // GET /api/annonces/cities
router.get('/' ,getAllAnnonces);         // GET /api/annonces
router.get('/:id', getAnnonce);         // GET /api/annonces/:id

module.exports = router;