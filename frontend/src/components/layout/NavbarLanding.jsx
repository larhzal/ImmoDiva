import Logo from "../../assets/images/Logo.png";
import "../../styles/layout/Navbar.css"; 

export default function NavbarLanding() {
  return (
    <>
      <div className="top-bar"></div>
      <nav className="navbar">
        <div className="nav-logo">
          <img src={Logo} alt="Immo DIVA" className="logo-img" />
        </div>
        <div className="nav-links">
          <a href="/tarifs" className="nav-link">Tarifs</a>
          <a href="#" className="nav-link">Contact</a>
          <a href="/login" className="nav-link">Connexion</a>
          <a href="/role" className="nav-link-highlight">Mettre votre appartement en location</a>
        </div>
      </nav>
    </>
  );
}