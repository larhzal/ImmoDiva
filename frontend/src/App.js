import ProfilePage from './pages/profile/ProfilePage';
import Navbar from './components/layout/Navbar';
import RentalRequestPage from './pages/tenant/RentalRequestPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RentalRequestsPage from './pages/publisher/RentalRequestsPage';
import './styles/layout/StatsCard.css'
import './styles/layout/TabBar.css'
import RentalRequestDetailPage from './pages/publisher/RentalRequestDetailsPage';
import Toaster from 'react-hot-toast'

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/demande/:apartmentId" element={<RentalRequestPage />} />
          <Route path="/demandes" element={<RentalRequestsPage />} />
          <Route path="/demandes/:id" element={<RentalRequestDetailPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;