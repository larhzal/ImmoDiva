import Logo from "../../assets/images/Logo.png";

const styles = {
  navbar: {
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    height: 102,
    borderBottom: "1px solid #e8eaed",
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    marginTop: 10,
  },
  logoImg: {
    height: 50,
    objectFit: "contain",
    margin: 20,
    padding: 20,
  },
  navLinks: {
    display: "flex",
    gap: 32,
    alignItems: "center",
  },
  navLink: {
    color: "#333",
    textDecoration: "none",
    fontSize: 14,
    whiteSpace: "nowrap",
  },
};

export default function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.navLogo}>
        <img src={Logo} alt="Immo DIVA" style={styles.logoImg} />
      </div>
      <div style={styles.navLinks}>
        <a href="#" style={styles.navLink}>Mon Espace</a>
        <a href="#" style={styles.navLink}>Tarifs</a>
        <a href="#" style={styles.navLink}>Ajouter une appartement à louer</a>
        <a href="#" style={styles.navLink}>Déonnexion</a>
      </div>
    </nav>
  );
}