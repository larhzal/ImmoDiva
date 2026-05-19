const { getAnnonces, getAnnonceById, getDistinctCities } = require('./listings.service');

/**
 * GET /api/annonces
 * Retourne toutes les annonces avec filtres optionnels (city, priceRange, rooms).
 */
const getAllAnnonces = async (req, res) => {
    try {
        const { city, priceRange, rooms } = req.query;
        const data = await getAnnonces({ city, priceRange, rooms });
        res.status(200).json(data);
    } catch (err) {
        console.error('[listingsController] getAllAnnonces:', err.message);
        res.status(500).json({ error: err.message });
    }
};

/**
 * GET /api/annonces/:id
 * Retourne une annonce par son ID.
 */
const getAnnonce = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getAnnonceById(id);

        if (!data) {
            return res.status(404).json({ error: 'Appartement non trouvé' });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('[listingsController] getAnnonce:', err.message);
        res.status(500).json({ error: err.message || 'Une erreur est survenue.' });
    }
};

/**
 * GET /api/annonces/cities
 * Retourne la liste des villes disponibles dans la DB.
 */
const getCities = async (req, res) => {
    try {
        const cities = await getDistinctCities();
        res.status(200).json(cities);
    } catch (err) {
        console.error('[listingsController] getCities:', err.message);
        res.status(500).json({ error: 'Impossible de récupérer les villes.' });
    }
};

module.exports = { getAllAnnonces, getAnnonce, getCities };