// src/App.js

import LandingPage        from './pages/LandingPage';
import LoginPage          from './pages/auth/LoginPage';
import RegisterPage       from './pages/auth/RegisterPage';
import RolePage           from './pages/auth/RolePage';
import ListingsPage       from './pages/listings/ListingsPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';  // ← ajout
import ResetPasswordPage  from './pages/auth/ResetPasswordPage';   // ← ajout

function App() {
  const route = window.location.pathname.replace(/\/+$/, '') || '/';

  if (route === '/login') {
    return <LoginPage />;
  }

  if (route === '/register') {
    return <RegisterPage />;
  }

  if (route === '/role') {
    return <RolePage />;
  }

  if (route === '/listings') {
    return <ListingsPage />;
  }

  // ── Ajouts US3 ────────────────────────────────
  if (route === '/forgot-password') {
    return <ForgotPasswordPage />;
  }

  if (route === '/reset-password') {
    return <ResetPasswordPage />;
  }
  // ──────────────────────────────────────────────

  return <LandingPage />;
}

export default App;