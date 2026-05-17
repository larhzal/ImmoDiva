import React from 'react';
import Navbar from './components/layout/Navbar';
import AppRouter from './router/AppRouter';
import './index.css';
import PendingApartments from './pages/admin/PendingApartments';

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <AppRouter />
    </>
  );
}

export default App;
