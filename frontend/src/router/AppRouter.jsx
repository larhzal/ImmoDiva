import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ListingsPage from '../pages/listings/ListingsPage';
import ApartmentDetailPage from '../pages/listings/ApartmentDetailPage';
import ProfilePage from '../pages/profile/ProfilePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import FeedbackPage from '../pages/tenant/FeedbackPage';
import  RolePage from '../pages/auth/RolePage'
import RentalRequestPage from '../pages/tenant/RentalRequestPage'
const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ListingsPage />} />
                <Route path="/listings" element={<ListingsPage />} />
                <Route path="/apartment/:id" element={<ApartmentDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/role" element={<RolePage />} />
                <Route path="/demande/:apartmentId" element={<RentalRequestPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/feedback/:id" element={<FeedbackPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;