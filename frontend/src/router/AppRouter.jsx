import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Non-authentiated pages
import ListingsPage from '../pages/listings/ListingsPage';
import ApartmentDetailPage from '../pages/listings/ApartmentDetailPage';
import Tarifs from '../pages/listings/Tarifs';

// To authenticate
import LoginPage from '../pages/auth/LoginPage';
import RolePage from '../pages/auth/RolePage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// publisher pages
import MyApartmentsPage from '../pages/publisher/MyApartmentsPage';
import MyClientsPage from '../pages/publisher/MyClientsPage';
import RentalRequestsPage from '../pages/publisher/RentalRequestsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import RentalRequestDetailPage from '../pages/publisher/RentalRequestDetailsPage';
import UpdateAppartement  from '../pages/publisher/UpdateApartmentPage';
import AddAppartement from '../pages/publisher/AddApartmentPage';

// Admin pages
import PendingApartments from '../pages/admin/PendingApartments';

// tenant pages
import FeedbackPage from '../pages/tenant/FeedbackPage';
import RentalRequestPage from '../pages/tenant/RentalRequestPage';
import ClientProfilePage from '../pages/profile/ClientProfilePage';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Non-authentiated pages */}
                <Route path="/" element={<ListingsPage />} />
                <Route path="/listings" element={<ListingsPage />} />
                <Route path="/apartment/:id" element={<ApartmentDetailPage />} />
                <Route path="/tarifs" element={<Tarifs />} />

                {/* To authenticate */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/role" element={<RolePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* publisher pages */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/demandes" element={<RentalRequestsPage />} />
                <Route path="/demandes/:id" element={<RentalRequestDetailPage />} />
                <Route path="/publisher-profile" element={<ProfilePage />} />
                <Route path="/my-apartments" element={<MyApartmentsPage />} />
                <Route path="/apartments/edit/:id" element={<UpdateAppartement />} />
                <Route path="/my-clients" element={<MyClientsPage />} />
                <Route path="/addApartment" element={<AddAppartement />} />

                {/* Admin pages */}
                <Route path="/apartments/pending" element={<PendingApartments />} />

                {/* tenant pages */}
                <Route path="/client-profile" element={<ClientProfilePage />} />
                <Route path="/demande/:apartmentId" element={<RentalRequestPage />} />
                <Route path="/feedback/:id" element={<FeedbackPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;