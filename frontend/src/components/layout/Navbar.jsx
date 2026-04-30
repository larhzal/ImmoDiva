import Logo from "../../assets/images/Logo.png";
import "../../styles/layout/Navbar.css"; 

export default function Navbar() {
  return (
    <>
      <div className="top-bar"></div>
      <nav className="navbar">
        <div className="nav-logo">
          <img src={Logo} alt="Immo DIVA" className="logo-img" />
        </div>
        <div className="nav-links">
          <a href="#" className="nav-link">Mon Espace</a>
          <a href="#" className="nav-link">Tarifs</a>
          <a href="#" className="nav-link">Ajouter une appartement à louer</a>
          <a href="#" className="nav-link">Déconnexion</a>
        </div>
      </nav>
    </>
  );
}