const rentalsService = require("./rentals.service");
const { sendEmailToOwner } = require("../../services/email.service");


//Envoyer une demande de location
exports.creerDemande = async (req, res) => {
  try {
    // Pour tests
    const clientId = req.body.client_id || "8342fbeb-60e4-42fd-8e8a-6c61ea56ac92";

    // En production :
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
        message: "Tous les champs obligatoires doivent être remplis",
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
      nb_enfants: presence_enfants ? nb_enfants || null : null,
      fumeur,
      animaux,
      date_emmenagement,
      duree_location: parseInt(duree_location),
      unite_duree,
      presentation,
      motivation,
    };
//enregister la demande dans la base de donness
    const demande = await rentalsService.add_request(donnees);
//recuperer l'email de proprietaire de l'appartement
    const ownerEmail = await rentalsService.getOwnerEmailByApartmentId(apartment_id);
//envoyer l'email
console.log("OWNER EMAIL =>", ownerEmail);
    await sendEmailToOwner({
      to: ownerEmail,
      subject: "Nouvelle demande de location",
      html: `
      <div style="font-family:Arial;background:#f6f6f6;padding:20px">
        <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:10px">

          <h2 style="color:#2c3e50;text-align:center">
            Nouvelle demande de location
          </h2>

          <p>Bonjour,</p>

          <p>Vous avez reçu une nouvelle demande pour votre appartement.</p>

          <div style="background:#f1f1f1;padding:10px;border-radius:6px">
            <p><b>Nom :</b> ${prenom} ${nom}</p>
            <p><b>Email :</b> ${email}</p>
            <p><b>Statut :</b> ${statut}</p>
            <p><b>Profil :</b> ${profil}</p>
            <p><b>Nombre de personnes :</b> ${nb_personnes}</p>
            <p><b>Fumeur :</b> ${fumeur ? "Oui" : "Non"}</p>
            <p><b>Animaux :</b> ${animaux ? "Oui" : "Non"}</p>
          </div>

          <p style="margin-top:20px;color:#777">
            Connectez-vous à votre espace pour voir les détails.
          </p>

        </div>
      </div>
      `,
    })

   
    return res.status(201).json({
      message: "Demande envoyée avec succès et notification envoyée au propriétaire",
      demande,
    });

  } catch (err) {
    console.error("Erreur dans creerDemande:", err);

    return res.status(500).json({
      message: "Erreur serveur",
      error: err.message,
    });
  }
};

exports.getDemandesRecues = async (req, res) => {
  try {
    // const publisher = req.user.id
    const publisherTest = "588c391f-5013-4d15-8e22-48349f725f55"
    const demandes = await rentalsService.getDemandesRecues(publisherTest)
    res.status(200).json(demandes)
  } catch (err) {
    res.status(500).json({
      message: "Erreur serveur",
      error: err.message
    })
  }
}



//fonction pour accepter la demande de location vient du client 
exports.accepterDemande = async (req, res) => {
  try {
    const { id } = req.params;

    const demande = await rentalsService.repondreDemande(id, "accepted");

    res.status(200).json({
      message: "Demande acceptée avec succès",
      demande,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
// fonction pour refuser la demande
exports.refuserDemande = async (req, res) => {
  try {
    const { id } = req.params;

    const demande = await rentalsService.repondreDemande(id, "refused");

    res.status(200).json({
      message: "Demande refusée avec succès",
      demande,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
