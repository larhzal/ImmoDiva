import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getDemandeById,
  updateRequestStatus
} from "../../services/rentalService";
import { MapPin } from "lucide-react";

import "../../styles/ui/RentalRequestDetails.css";
import Loader from "../../components/ui/loader";

export default function RentalRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [traitement, setTraitement] = useState(false);
  const [alertBox, setAlertBox] = useState(null);

  useEffect(() => {
    chargerDemande();
  }, [id]);

  

  const chargerDemande = async () => {
    try {
      setLoading(true);
      const data = await getDemandeById(id);
      setDemande(data);
    } catch (err) {
      setErreur("Erreur lors du chargement de la demande");
    } finally {
      setLoading(false);
    }
  };

  const handleReponse = async (reponse) => {
  try {
    setTraitement(true);

    await updateRequestStatus(id, reponse);
    await chargerDemande()
    setAlertBox({
      message: `Demande ${reponse} avec succès !`,
      type: "success",
    });

    setTimeout(() => {
      setAlertBox(null);
      navigate("/demandes",{replace:true});
    }, 3000);

  } catch (err) {
    setErreur("Erreur lors du traitement de la demande");

    setAlertBox({
      message: "Erreur lors du traitement",
      type: "error",
    });

    setTimeout(() => {
      setAlertBox(null);
    }, 2000);

  } finally {
    setTraitement(false);
  }
};

  if (loading) return <Loader />;
  if (erreur) return <p className="error">{erreur}</p>;
  if (!demande) return null;

  const toStorageURL = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    return `https://fipyteeltzqzeifwdpca.supabase.co/storage/v1/object/public/appartements/${path}`;
  };

  const apt = demande.Apartment || {};
  const photos =
    demande.Apartment?.Pictures?.map((p) => toStorageURL(p.file_path)) || [];

  return (
    <div className="pageContainer">
      <div className="contentContainer">

        
        {alertBox && (
        <div className="alertOverlay">
            <div className={`alertBox ${alertBox.type}`}>
            {alertBox.message}
            </div>
        </div>
        )}

        {/* TITLE */}
        <h1 className="title">Validation de la demande de location</h1>
        <hr className="divider" />

        {/* APPARTEMENT */}
        <h2 className="sectionTitle">Appartement</h2>

        <div className="card">
          <div className="apartmentRow">

            <img
              src={photos[0] || "../../assets/images/logo.png"}
              className="apartmentImage"
              alt="appartement"
            />

            <div className="apartmentInfo">

              <div className="priceBadge">
                {apt.monthly_price
                  ? `${apt.monthly_price.toLocaleString()} MAD / mois`
                  : "Prix non défini"}
              </div>

              <h3 className="apartmentTitle">{apt.title || "—"}</h3>

              <p className="address">
                <MapPin size={16} />
                <span>{apt.address}, {apt.city}</span>
              </p>

            </div>
          </div>
        </div>

        {/* CLIENT */}
        <h2 className="sectionTitle">Client</h2>

        <div className="card clientCard">

          <div className="clientHeader">
            <div>
              <h3 className="clientName">
                {demande.User.first_name} {demande.User.last_name}, {demande.User.age} ans ({demande.User.nationality})
              </h3>
              <p className="clientEmail">{demande.email}</p>
            </div>

            <button className="profileBtn">Voir le profile</button>
          </div>

          <div className="gridInfo">
            {[
              { label: "Profile", value: demande.profil },
              { label: "Nombre de personnes", value: demande.nb_personnes },
              { label: "Fumeur", value: demande.fumeur ? "Oui" : "Non" },
              { label: "Présence enfants", value: demande.presence_enfants ? "Oui" : "Non" },
              { label: "Status", value: demande.statut },
              { label: "Animaux", value: demande.animaux ? "Oui" : "Non" }
            ].map((item) => (
              <div key={item.label} className="infoRow">
                <span className="label">{item.label} :</span>
                <span className="value">{item.value || "—"}</span>
              </div>
            ))}
          </div>

          {/* DATE + DUREE */}
          <div className="row rowSplit">

            <div className="rowItem">
              <span>Date d’emménagement :</span>
              <span className="valueBox">
                {demande.date_emmenagement
                  ? new Date(demande.date_emmenagement).toLocaleDateString("fr-FR")
                  : "—"}
              </span>
            </div>

            <div className="rowItem">
              <span>Durée :</span>
              <span className="valueBox">
                {demande.duree_location || "—"} {demande.unite_duree}
              </span>
            </div>

          </div>

          <div className="block">
            <label>Présentation</label>
            <div className="box">{demande.presentation || "—"}</div>
          </div>

          <div className="block">
            <label>Motivation</label>
            <div className="box">{demande.motivation || "—"}</div>
          </div>

        </div>

        {/* ACTIONS */}
        {!demande.response || demande.response === "en_attente" ? (
  <div className="actions">
    <button
      className="acceptBtn"
      disabled={traitement}
      onClick={() => handleReponse("accepted")}
    >
      {traitement ? "..." : "Accepter"}
    </button>

    <button
      className="rejectBtn"
      disabled={traitement}
      onClick={() => handleReponse("refused")}
    >
      {traitement ? "..." : "Rejeter"}
    </button>
  </div>
            ) : demande.response === "accepted" ? (
            <div className="statusAccept">
                Demande acceptée
            </div>
            ) : (
            <div className="statusRefuse">
                Demande refusée
            </div>
            )}

                </div>
                </div>
            );
}