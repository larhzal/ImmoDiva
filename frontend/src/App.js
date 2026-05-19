import React from 'react';
import Navbar from './components/layout/Navbar';
import AppRouter from './router/AppRouter';
import './index.css';
import PendingApartments from './pages/admin/PendingApartments';
import AdminHome from './pages/admin/AdminHome';

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <AppRouter />
      {/* <AdminHome /> */}
    </>
  );
}

export default App;
