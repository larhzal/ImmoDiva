const rentalsService = require('./rentals.service');

// Envoyer une demande de location
exports.creerDemande = async (req, res) => {
  try {
    //pour tests 
    const clientId = req.body.client_id || "8342fbeb-60e4-42fd-8e8a-6c61ea56ac92";
    //en production decommenter la ligne 9 et commenter la ligne 7
    // const clientId = req.user.id;

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
      nb_enfants,
      fumeur,
      animaux,
      date_emmenagement,
      duree_location,
      unite_duree,     
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
      !unite_duree ||     
      !presentation ||
      !motivation
    ) {
      return res.status(400).json({
        message: 'Tous les champs obligatoires doivent être remplis',
      });
    }

    const unitesValides = ["jours", "semaines", "mois"];
    if (!unitesValides.includes(unite_duree)) {
      return res.status(400).json({
        message: "L'unité de durée doit être 'jours', 'semaines' ou 'mois'",
      });
    }
    const donnees = {
      apartment_id,
      client_id: clientId,
      statut,
      profil,
      nb_personnes: parseInt(nb_personnes),
      presence_enfants,
      nb_enfants: presence_enfants ? (nb_enfants || null) : null,
      fumeur,
      animaux,
      date_emmenagement,
      duree_location: parseInt(duree_location),
      unite_duree,               
      presentation,
      motivation,
    };

    
    const demande = await rentalsService.add_request(donnees);

    return res.status(201).json({
      message: 'Demande envoyée avec succès',
      demande,
    });

  } catch (err) {
    return res.status(500).json({
      message: 'Erreur serveur',
      error: err.message,
    });
  }
};