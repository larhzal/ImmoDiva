import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "../../styles/pages/rentalRequest.css"
import { createDemandeLocation } from "../../services/rentalService"
//ligne 6 a commente pour tester
import { useAuth } from "../../hooks/useAuth"
import Navbar from "../../components/layout/Navbar"

export default function RentalRequestPage() {

  const { apartmentId } = useParams()
  const navigate = useNavigate()
  // ligne 13 a commente 
  const { user } = useAuth()
  console.log(user);

  const [formData, setFormData] = useState({
    prenom:  "",
    nom:  "",
    age: "",
    nationalite:"",
    email: "",
    statut: "",
    profil: "",
    nb_personnes: "",
    presence_enfants: false,
    nb_enfants: "",
    fumeur: false,
    animaux: false,
    date_emmenagement: "",
    duree_location: "",
    unite_duree:"",
    presentation: "",
    motivation: ""
  })

  useEffect(() => {
      console.log("USER :", user);
  if (user) {

    setFormData((prev) => ({
      ...prev,

      prenom: user.first_name || "",
      nom: user.last_name || "",
      age: user.age || "",
      nationalite: user.nationality || "",
      email: user.email || "",
    }));
  }

}, [user]);

  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    const { name, value, type } = e.target
//pour la gestion des inputs de type radios
    if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "true"
      }))
      return
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  
  const validateForm = () => {
    // Champs obligatoires simples
    const requiredFields = [
      "prenom", "nom", "age", "nationalite", "email",
      "statut", "profil", "nb_personnes",
      "date_emmenagement", "duree_location","unite_duree",
      "presentation", "motivation"
    ];

    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        return `Le champ "${field}" est obligatoire.`;
      }
    }

    if (formData.presence_enfants !== true && formData.presence_enfants !== false) {
      return "Veuillez indiquer s’il y a des enfants.";
    }

    // si presence enfants = true donc le champ de nb enfants devient aussi obligatoire 
    if (formData.presence_enfants === true && !formData.nb_enfants) {
      return "Veuillez indiquer le nombre d'enfants.";
    }

    //fumeur obligatoire
    if (formData.fumeur !== true && formData.fumeur !== false) {
      return "Veuillez indiquer si vous fumez.";
    }

    //animaux obligatoire
    if (formData.animaux !== true && formData.animaux !== false) {
      return "Veuillez indiquer si vous avez des animaux.";
    }

    if (!formData.duree_location || formData.duree_location <= 0) {
      return "Veuillez indiquer la durée de location.";
    }

    if (!formData.unite_duree) {
      return "Veuillez choisir l'unité de durée (jours, semaines ou mois).";
    }

    return null;
  };
  

  const handleSubmit = async (e) => {
      e.preventDefault();
      setErreur(null);
      setSuccess(false);

      const validationError = validateForm();
      if (validationError) {
        setErreur(validationError);
        return;
      }

      setLoading(true);

      try {
        const payload = {
          ...formData,
          apartment_id: apartmentId,
          duree_location: Number(formData.duree_location),
          unite_duree: formData.unite_duree
        };

        const res = await createDemandeLocation(payload);
        console.log("Réponse backend :", res.data);
        setFormData({
          prenom: "",
          nom: "",
          age: "",
          nationalite: "",
          email: "",
          statut: "",
          profil: "",
          nb_personnes: "",
          presence_enfants: false,
          nb_enfants: "",
          fumeur: false,
          animaux: false,
          date_emmenagement: "",
          duree_location: "",
          unite_duree:"",
          presentation: "",
          motivation: ""
        });

        setSuccess(true);

      } catch (err) {
        setErreur(
          err.response?.data?.message ||
          "Erreur lors de l'envoi de la demande."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <>
    <Navbar/>
    <div className="rental-request-form">
      
      {loading && (
        <div className="loading-overlay">
          <div className="loading-card">
            <div className="spinner"></div>
            <p>Envoi de votre demande en cours...</p>
          </div>
        </div>
      )}
      {success && (
      <div className="success-overlay">
        <div className="success-card">
          <div className="success-icon">✔</div>

          <h2>Merci pour votre demande !</h2>
          <p>Votre demande a bien été enregistrée.</p>

          <button onClick={() => navigate("/")} className="success-btn">Retour à l'accueil</button>
        </div>
      </div>
    )}
      <h1>Envoyer la demande de location</h1>

      <form onSubmit={handleSubmit} style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.6 : 1 }}>
        {/* personal infoss */}
        <h2>Votre Identité et Contact</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>Prénom</label>
            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Nom</label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Âge</label>
            <input name="age" type="number" value={formData.age} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Nationalité</label>
            <input name="nationalite" type="text" value={formData.nationalite} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Statut</label>
            <select name="statut" value={formData.statut} onChange={handleChange} required>
              <option value="">Choisir...</option>
              <option value="Salarie">Salarié</option>
              <option value="Etudiant">Étudiant</option>
              <option value="Independant">Indépendant</option>
              <option value="Retrait">Retraité</option>
            </select>
          </div>

          <div className="form-group">
            <label>Profil</label>
            <select name="profil" value={formData.profil} onChange={handleChange} required>
              <option value="">Choisir...</option>
              <option value="Seul">Seul</option>
              <option value="Couple">Couple</option>
              <option value="Famille">Famille</option>
            </select>
          </div>

          <div className="form-group">
            <label>Nombre de personnes</label>
            <input name="nb_personnes" type="number" value={formData.nb_personnes} onChange={handleChange} required />
          </div>
        </div>

        {/* the client has children ? */}
        <div className="radio-group">
          <label>Présence d'enfants :</label>
          <div className="radio-options">
            <label>
              <input type="radio" name="presence_enfants" value="true" onChange={handleChange} /> Oui
            </label>
            <label>
              <input type="radio" name="presence_enfants" value="false" onChange={handleChange} /> Non
            </label>
          </div>
        </div>

        {formData.presence_enfants && (
          <div className="conditional-field">
            <div className="form-group">
              <label>Combien d'enfants</label>
              <input
                name="nb_enfants"
                type="number"
                value={formData.nb_enfants}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* the client is smoker or not ?*/}
        <div className="radio-group">
          <label>Fumeur :</label>
          <div className="radio-options">
            <label><input type="radio" name="fumeur" value="true" onChange={handleChange} /> Oui</label>
            <label><input type="radio" name="fumeur" value="false" onChange={handleChange} /> Non</label>
          </div>
        </div>

        {/* Animals ? */}
        <div className="radio-group">
          <label>Animaux :</label>
          <div className="radio-options">
            <label><input type="radio" name="animaux" value="true" onChange={handleChange} /> Oui</label>
            <label><input type="radio" name="animaux" value="false" onChange={handleChange} /> Non</label>
          </div>
        </div>

        {/* Conditions */}
        <h2>Conditions souhaitées</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>Date d'emménagement</label>
            <input name="date_emmenagement" type="date" value={formData.date_emmenagement} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Durée de location</label>

            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="number"
                name="duree_location"
                min="1"
                value={formData.duree_location}
                onChange={handleChange}
                required
                placeholder="Ex : 3"
              />

              <select
                name="unite_duree"
                value={formData.unite_duree}
                onChange={handleChange}
                required
              >
                <option value="">Choisir…</option>
                <option value="jours">Jours</option>
                <option value="semaines">Semaines</option>
                <option value="mois">Mois</option>
              </select>
            </div>
          </div>
        </div>

        {/* other infos */}
        <h2>Message libre</h2>

        <div className="form-group">
          <label>Présentation</label>
          <textarea name="presentation" value={formData.presentation} onChange={handleChange} rows={4} required />
        </div>

        <div className="form-group">
          <label>Motivation</label>
          <textarea name="motivation" value={formData.motivation} onChange={handleChange} rows={4} required />
        </div>

        {erreur && <p className="error-message">{erreur}</p>}
        
        <div className="clearfix">
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Envoi en cours..." : "Envoyer la demande"}
          </button>
        </div>
      </form>
    </div>
    </>
  )
}