import ProfilePage from './pages/profile/ProfilePage';
import Navbar from './components/layout/Navbar';
import RentalRequestPage from './pages/tenant/RentalRequestPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RentalRequestsPage from './pages/publisher/RentalRequestsPage';

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/demande/:apartmentId" element={<RentalRequestPage />} />
          <Route path="/publisher/demandes" element={<RentalRequestsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;