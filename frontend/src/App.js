import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProfilePage from './pages/profile/ProfilePage';
import ClientProfilePage from './pages/profile/ClientProfilePage';
import MyApartmentsPage from './pages/publisher/MyApartmentsPage';
import MyClientsPage from './pages/publisher/MyClientsPage';
import Tarifs from './pages/listings/Tarifs';

import UpdateAppartement from './pages/publisher/UpdateApartmentPage';

function App() {
  return (
    <Router>      
      <Routes>
        {/* Redirect home to your profile for now */}
        <Route path="/" element={<Navigate to="/" />} />

        <Route path="/tarifs" element={<Tarifs />} />

        {/* Path for the Agent/Owner Profile (ProfilePage.jsx) */}
        <Route path="/publisher-profile" element={<ProfilePage />} />

        {/* Path for the Client/Tenant Profile */}
        <Route path="/client-profile" element={<ClientProfilePage />} />

        {/* Path for the Publisher's Apartments */}
        <Route path="/my-apartments" element={<MyApartmentsPage />} />

        {/* Path for the Publisher's Apartments */}
        <Route path="/apartments/edit/:id" element={<UpdateAppartement />} />

        {/* Path for the Publisher's Clients */}
        <Route path="/my-clients" element={<MyClientsPage />} />
      </Routes>
    </Router>
  );
}

export default App;