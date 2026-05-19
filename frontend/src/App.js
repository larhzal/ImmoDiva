import React from 'react';
import Navbar from './components/layout/Navbar';
import AppRouter from './router/AppRouter';
import './index.css';
import PendingApartments from './pages/admin/PendingApartments';
import AdminHome from './pages/admin/AdminHome';
import AdminUsersPage from './pages/admin/AdminUsersPage'; 

function App() {
  return (
    <>
      <Navbar />
      <AdminUsersPage />
      {/* <Navbar /> */}
      <AppRouter />
      {/* <AdminHome /> */}
    </>
  );
}

export default App;
