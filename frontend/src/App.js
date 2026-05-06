import React from 'react';
import Navbar from './components/layout/Navbar';
// Correction : Ajout de l'import manquant pour ListingsPage
import ListingsPage from './pages/listings/ListingsPage';
import ProfilePage from './pages/profile/ProfilePage';

function App() {
  return (
    <>
      <Navbar />
      <ListingsPage />
    </>
  );
}

export default App;