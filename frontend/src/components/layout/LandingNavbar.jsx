import Logo from "../../assets/images/Logo.png";
import "../../styles/layout/Navbar.css"; 

export default function NavbarLanding() {
  return (
    <>
      <div className="top-bar"></div>
      <nav className="navbar">
         {/* Logo */}
        <div className="nav-logo">
            <a href="/listings">
            <img
            src={Logo}
            alt="Immo DIVA"
            className="logo-img"
            />
            </a>
        </div>
        <div className="nav-links">
          <a href="/tarifs" className="nav-link">Tarifs</a>
          <a href="/about" className="nav-link">
            À propos
          </a>
          <a
                href="/login"
                className="nav-link"
              >
                Se connecter 
              </a>

              <a
                href="/register"
                className="register-btn"
              >
                S'inscrire
              </a>
        </div>
      </nav>
    </>
  );
}