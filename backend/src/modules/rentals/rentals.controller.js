const rentalsService = require("./rentals.service");
const { sendEmail } = require("../../services/email.service");


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
    await sendEmail({
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
    const publisher = req.user.id
    // const publisherTest = "c081cec2-4d39-461a-adfc-a0870fdfcb6e"
    const demandes = await rentalsService.getDemandesRecues(publisher)
    res.status(200).json(demandes)
  } catch (err) {
    res.status(500).json({
      message: "Erreur serveur",
      error: err.message
    })
  }
}



//fonction pour accepter la demande de location vient du client 
exports.accept_request = async (req, res) => {
  try {
    const { id } = req.params;

    const demande = await rentalsService.repondreDemande(id, "accepted");
    //on recupere la demande pour recuperer l'email de l'utilisateur
    const fullDemande = await rentalsService.getDemandeById(id);
    console.log(fullDemande);
    
    const clientEmail = fullDemande.email;

    await sendEmail({
      to: clientEmail,
      subject: "Votre demande a été acceptée",
      html: `
          <div style="font-family: 'Arial', sans-serif; background: #f5f7fa; padding: 40px;">
            <div style="
              max-width: 600px;
              margin: auto;
              background: #ffffff;
              border-radius: 14px;
              padding: 35px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            ">

              <h2 style="
                color: #2ecc71;
                text-align: center;
                font-size: 26px;
                margin-bottom: 10px;
              ">
                Votre demande a été acceptée
              </h2>

              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Félicitations ! Votre demande pour l’appartement
                <strong style="color:#000;">${fullDemande.Apartment.title}</strong>
                a été <strong style="color:#2ecc71;">acceptée</strong>.
              </p>

              <p style="color: #444; font-size: 16px; line-height: 1.6;">
                Le propriétaire vous contactera très prochainement pour finaliser les étapes de location.
              </p>

              <div style="text-align: center; margin-top: 25px;">
                <a href="http://localhost:3000/"
                  style="
                    background: #2ecc71;
                    color: white;
                    padding: 14px 24px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 15px;
                    font-weight: bold;
                  ">
                  Voir ma demandes
                </a>
              </div>

              <p style="margin-top: 35px; color: #999; font-size: 13px; text-align:center;">
                ImmoDiva — Plateforme de location immobilière.
              </p>
            </div>
          </div>
        `   });
    res.status(200).json({
      message: "Demande acceptée avec succès",
      demande,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
// fonction pour refuser la demande
exports.reject_request = async (req, res) => {
  try {
    const { id } = req.params;

    const demande = await rentalsService.repondreDemande(id, "refused");

    const fullDemande = await rentalsService.getDemandeById(id);
    const clientEmail = fullDemande.email;
    console.log(clientEmail);
    
    //envoyer mail
    await sendEmail({
      to: clientEmail,
      subject: "Votre demande a été refusée",
      html: `
        <div style="font-family: 'Arial', sans-serif; background: #f5f7fa; padding: 40px;">
          <div style="
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            border-radius: 14px;
            padding: 35px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          ">

            <h2 style="
              color: #e74c3c;
              text-align: center;
              font-size: 26px;
              margin-bottom: 10px;
            ">
              Votre demande a été refusée
            </h2>

            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Nous sommes désolés. Votre demande concernant l’appartement
              <strong style="color:#000;">${fullDemande.Apartment.title}</strong>
              a été <strong style="color:#e74c3c;">refusée</strong> par le propriétaire.
            </p>

            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              Vous pouvez continuer à explorer d'autres appartements adaptés à vos besoins.
            </p>

            <div style="text-align: center; margin-top: 25px;">
              <a href="http://localhost:3000/"
                style="
                  background: #e74c3c;
                  color: white;
                  padding: 14px 24px;
                  border-radius: 8px;
                  text-decoration: none;
                  font-size: 15px;
                  font-weight: bold;
                ">
                Explorer les appartements
              </a>
            </div>

            <p style="margin-top: 35px; color: #999; font-size: 13px; text-align:center;">
              ImmoDiva — Plateforme de location immobilière.
            </p>
          </div>
        </div>
      `
    });
    res.status(200).json({
      message: "Demande refusée avec succès",
      demande,
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

//recuprer une demande par l'id dans l'url 
exports.getDemandeById = async (req, res) => {
  try {
    const demande = await rentalsService.getDemandeById(req.params.id)
    if (!demande) return res.status(404).json({ message: "Demande non trouvée" })
    res.status(200).json(demande)
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message })
  }
}