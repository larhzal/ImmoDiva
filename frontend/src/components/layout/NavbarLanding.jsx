import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
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
  );
}

export default App;