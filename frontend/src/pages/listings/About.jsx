import { FaTrophy, FaLock, FaGlobe, FaChartLine, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import "../../styles/pages/About.css";
import Navbar from "../../components/layout/Navbar";

export default function About() {
  const team = [
    { name: "FDILI Imane", role: "Chef de projet", exp: "10 ans" },
    { name: "LARHZAL Oumaima", role: "Analyste fonctionnel", exp: "7 ans" },
    { name: "LHAZMIR Ichraq", role: "Designer UI/UX", exp: "6 ans" },
    { name: "SOGHAR Nassira", role: "Développeur Backend", exp: "5 ans" },
    { name: "ZOUHRI Salma", role: "Développeur Frontend", exp: "5 ans" },
  ];

  const agenceVilles = ["Casablanca", "Rabat", "Meknès"];

  const valeurs = [
    { icon: <FaTrophy />, titre: "Excellence", desc: "Un service premium adapté aux professionnels marocains" },
    { icon: <FaLock />, titre: "Confiance", desc: "Annonces vérifiées, données sécurisées" },
    { icon: <FaChartLine />, titre: "Innovation", desc: "Digitalisation complète du cycle locatif" },
  ];

  const contacts = [
    { icon: <FaPhone />, label: "Téléphone", value: "+212 545-455422" },
    { icon: <FaEnvelope />, label: "Email", value: "contact@immopro.ma" },
    { icon: <FaClock />, label: "Horaires", value: "Lun – Ven : 9h00 – 18h00" },
  ];

  // Style réutilisable pour centrer les icônes en Flexbox
  const centerIconStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  };

  return (
    <>
      <Navbar/>
      <div className="about-page">

        <section className="about-hero">
          <div className="about-hero-content">
            <span className="about-badge">À propos</span>
            <h1>ImmoPro Maroc</h1>
            <p>
              Agence immobilière marocaine fondée en 2015, spécialisée dans
              la location et la gestion d'appartements professionnels.
            </p>
            <div className="about-hero-stats">
              <div className="stat">
                <span className="stat-number">25+</span>
                <span className="stat-label">Employés</span>
              </div>
              <div className="stat">
                <span className="stat-number">3</span>
                <span className="stat-label">Agences</span>
              </div>
              <div className="stat">
                <span className="stat-number">2015</span>
                <span className="stat-label">Fondée en</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="about-section">
          <div className="about-container">
            <h2>Notre mission</h2>
            <p>
              ImmoPro Maroc est une agence immobilière professionnelle qui centralise
              et simplifie la gestion locative au Maroc. Grâce à la plateforme ImmoDiva,
              nous offrons à nos clients un accès à des annonces vérifiées, couvrant
              l'ensemble du territoire marocain.
            </p>
            <p>
              Les propriétaires et agences partenaires peuvent publier leurs annonces
              depuis n'importe quelle ville du Maroc. Nos trois agences physiques
              à Casablanca, Rabat et Meknès assurent un accompagnement de proximité
              pour nos clients.
            </p>
          </div>
        </section>

        {/* Valeurs  */}
        <section className="about-values">
          <div className="about-container">
            <h2>Nos valeurs</h2>
            <div className="values-grid">
              {valeurs.map((v, i) => (
                <div key={i} className="value-card" style={{ textAlign: "center" }}>
                  <span className="value-icon" style={centerIconStyle}>
                    {v.icon}
                  </span>
                  <h3>{v.titre}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Agences (Modifié pour centrer l'icône de la ville) */}
        <section className="about-cities">
          <div className="about-container">
            <h2>Nos agences</h2>
            <p className="cities-subtitle">
              ImmoPro Maroc dispose de trois agences physiques au Maroc.
              Les annonces sur la plateforme sont ouvertes à tous les propriétaires
              et agences partenaires à travers tout le royaume.
            </p>
            <div className="cities-grid">
              {agenceVilles.map((ville, i) => (
                <div key={i} className="city-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={centerIconStyle}>
                    <FaMapMarkerAlt className="city-icon" />
                  </div>
                  <span>{ville}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Equipe */}
        <section className="about-team">
          <div className="about-container">
            <h2>Équipe de développement</h2>
            <p className="team-subtitle">
              La plateforme ImmoDiva a été conçue et développée par une équipe
              de 5 experts techniques.
            </p>
            <div className="team-grid">
              {team.map((membre, i) => (
                <div key={i} className="team-card">
                  <div className="team-avatar">
                    {membre.name.charAt(0)}
                  </div>
                  <h3>{membre.name}</h3>
                  <span className="team-role">{membre.role}</span>
                  <span className="team-exp">{membre.exp} d'expérience</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="about-contact">
          <div className="about-container">
            <div className="contact-wrapper">

              {/* Infos */}
              <div className="contact-info">
                <h2>Contactez-nous</h2>
                <p>
                  Notre équipe est disponible pour répondre à toutes vos questions
                  concernant nos services ou la plateforme ImmoDiva.
                </p>
                <div className="contact-items">
                  {contacts.map((c, i) => (
                    <div key={i} className="contact-item">
                      <div className="contact-item-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {c.icon}
                      </div>
                      <div>
                        <span className="contact-item-label">{c.label}</span>
                        <span className="contact-item-value">{c.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulaire */}
              <div className="contact-form-card">
                <h3>Envoyer un message</h3>
                <div className="form-group">
                  <label>Nom complet</label>
                  <input type="text" placeholder="Votre nom" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="votre@email.com" />
                </div>
                <div className="form-group">
                  <label>Sujet</label>
                  <input type="text" placeholder="Sujet de votre message" />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea rows="4" placeholder="Votre message..."></textarea>
                </div>
                <button className="contact-submit">Envoyer le message</button>
              </div>

            </div>
          </div>
        </section>

      </div>
    </>
  );
}