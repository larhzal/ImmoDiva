const rentalsService = require('./rentals.service');

// Envoyer une demande de location par le locataire
exports.creerDemande = async (req, res) => {
  try {
    //pour tester decommenter la ligne 7 et commenter la ligne 8
    // const clientId = req.body.client_id || "8342fbeb-60e4-42fd-8e8a-6c61ea56ac92"
    const clientId = req.user.id ;
    
    const {
      apartment_id,
      prenom,
      nom,
      age,
      nationalite,
      email,
      statut,
      profil,
      nb_personnes,
      presence_enfants,
      fumeur,
      animaux,
      date_emmenagement,
      duree_location,
      presentation,
      motivation,
    } = req.body;

    if (
      !apartment_id ||
      !prenom ||
      !nom ||
      !age ||
      !nationalite ||
      !email ||
      !statut ||
      !profil ||
      !nb_personnes ||
      presence_enfants === undefined ||
      fumeur === undefined ||
      animaux === undefined ||
      !date_emmenagement ||
      !duree_location ||
      !presentation ||
      !motivation
    ) {
      return res.status(400).json({
        message: 'Tous les champs obligatoires doivent être remplis',
      });
    }
    const donnees = {
      apartment_id,
      client_id: clientId,
      statut,
      profil,
      nb_personnes: parseInt(nb_personnes),
      presence_enfants,
      nb_enfants: req.body.nb_enfants || null,
      fumeur,
      animaux,
      date_emmenagement,
      duree_location,
      presentation,
      motivation,
    };
    const demande = await rentalsService.add_request(donnees);

    res.status(201).json({
      message: 'Demande envoyée avec succès',
      demande,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Erreur serveur',
      error: err.message,
    });
  }
};
