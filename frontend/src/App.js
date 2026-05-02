import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProfilePage from './pages/profile/ProfilePage';
import ClientProfilePage from './pages/profile/ClientProfilePage';
// Note: We don't import a global Navbar here because each profile page 
// currently imports its own specific Navbar (ClientNavbar or Publisher Navbar)[cite: 1, 2]

function App() {
  return (
    <Router>      
      <Routes>
        {/* Redirect root to the publisher profile by default for testing */}
        <Route path="/" element={<Navigate to="/publisher-profile" />} />

        {/* Route for the Agent/Owner Profile */}
        {/* This page uses ProfilePage.jsx which includes its own Navbar[cite: 3] */}
        <Route path="/publisher-profile" element={<ProfilePage />} />

        {/* Route for the Client/Tenant Profile */}
        {/* This page uses ClientProfilePage.jsx which includes ClientNavbar[cite: 2] */}
        <Route path="/client-profile" element={<ClientProfilePage />} />

        {/* Fallback route for 404 - Redirects back to a safe page */}
        <Route path="*" element={<Navigate to="/publisher-profile" />} />
      </Routes>
    </Router>
  );
}

export default App;