import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "../../styles/ui/rentalRequest.css"
import { createDemandeLocation } from "../../services/rentalService"
import { useAuth } from "../../hooks/useAuth"

export default function RentalRequestPage() {

  const { apartmentId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    age: "",
    nationalite: "",
    email: user?.email || "",
    statut: "",
    profil: "",
    nb_personnes: "",
    presence_enfants: false,
    nb_enfants: "",
    fumeur: false,
    animaux: false,
    date_emmenagement: "",
    duree_location: "",
    presentation: "",
    motivation: ""
  })

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

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErreur(null);
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        apartment_id: apartmentId,
      };

      const res = await createDemandeLocation(payload);

      console.log("Réponse backend :", res.data);

      setSuccess(true);

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
        presentation: "",
        motivation: ""
      });

      // redirection après 2 secondes 
      setTimeout(() => {
        navigate("/");
      }, 2000);

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
    <div className="rental-request-form">
      <h1>Envoyer la demande de location</h1>

      <form onSubmit={handleSubmit}>
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
            <input type="text" name="duree_location" value={formData.duree_location} onChange={handleChange} required />
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
        {success && (
          <p className="success-message">
            Demande envoyée avec succès 
          </p>
        )}

        <div className="clearfix">
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Envoi en cours..." : "Envoyer la demande"}
          </button>
        </div>
      </form>
    </div>
  )
}