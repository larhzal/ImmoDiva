import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
<<<<<<< HEAD
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
=======
    <Router>
      <div className="App">
        <Routes>
          {/* Route dyal l-Accueil (Home) */}
          <Route path="/" element={<div>Hna l-Accueil (Home Page)</div>} />

          {/* LA ROUTE LI KHASSNA DABA */}
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
      </div>
    </Router>
>>>>>>> feature/us-21-22-user-bloque-debloque
  );
}

export default App;