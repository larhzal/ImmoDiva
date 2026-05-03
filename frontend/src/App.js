import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProfilePage from './pages/profile/ProfilePage';
import ClientProfilePage from './pages/profile/ClientProfilePage';

function App() {
  return (
    <Router>      
      <Routes>
        {/* Redirect home to your profile for now */}
        <Route path="/" element={<Navigate to="/" />} />

        {/* Path for the Agent/Owner Profile (ProfilePage.jsx) */}
        <Route path="/publisher-profile" element={<ProfilePage />} />

        {/* Path for the Client/Tenant Profile */}
        <Route path="/client-profile" element={<ClientProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;