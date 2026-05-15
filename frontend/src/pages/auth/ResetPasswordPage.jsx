// L'utilisateur arrive ici depuis le lien email de Supabase :
//   https://tonapp.com/reset-password#access_token=xxx&type=recovery
//
// Flux :
//   1. Extraire access_token depuis window.location.hash
//   2. L'utilisateur saisit son nouveau mot de passe
//   3. POST /api/auth/reset-password → { accessToken, newPassword }
//   4. Redirection vers /login après succès

import React, { useEffect, useState } from 'react';
import Logo      from '../../assets/images/Logo.png';
import FormInput from '../../components/ui/FormInput';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ResetPasswordPage() {
  const [accessToken,    setAccessToken]    = useState('');
  const [tokenError,     setTokenError]     = useState('');
  const [formValues,     setFormValues]     = useState({ newPassword: '', confirmPassword: '' });
  const [errors,         setErrors]         = useState({});
  const [loading,        setLoading]        = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError,   setGeneralError]   = useState('');

  // Extraire le token depuis le hash de l'URL dès l'arrivée sur la page
  // Supabase redirige vers : /reset-password#access_token=xxx&type=recovery
// Remplacer l'ancien useEffect par :
useEffect(() => {
  const params = new URLSearchParams(window.location.search); // ← search, pas hash
  const token  = params.get('token');

  if (token) {
    setAccessToken(token);
  } else {
    setTokenError(
      "Lien de réinitialisation invalide ou expiré. Veuillez refaire une demande."
    );
  }
}, []); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev)     => ({ ...prev, [name]: undefined }));
    setGeneralError('');
  };

  const validate = () => {
    const errs = {};
    if (!formValues.newPassword) {
      errs.newPassword = 'Le mot de passe est requis.';
    } else if (formValues.newPassword.length < 6) {
      errs.newPassword = 'Le mot de passe doit contenir au moins 6 caractères.';
    }
    if (!formValues.confirmPassword) {
      errs.confirmPassword = 'La confirmation est requise.';
    } else if (formValues.newPassword !== formValues.confirmPassword) {
      errs.confirmPassword = 'Les mots de passe ne correspondent pas.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          accessToken:  accessToken,
          newPassword:  formValues.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setGeneralError(data.message || "Une erreur est survenue.");
        return;
      }

      setSuccessMessage(data.message);

      // Redirection vers la connexion après 2 secondes
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (err) {
      console.error('[ResetPasswordPage]', err);
      setGeneralError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 text-slate-900">
      <div className="h-32 bg-orange-400" />

      <main className="mx-auto -mt-24 flex w-full max-w-md flex-col items-center px-4 pb-12 sm:px-6">
        <div className="w-full overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-soft">

          {/* En-tête */}
          <div className="px-8 py-4 text-center">
            <img src={Logo} alt="ImmoDIVA" className="mx-auto h-16 w-auto mt-14 mb-4" />
            <h1 className="mt-10 text-3xl font-semibold text-slate-900">
              Nouveau mot de passe
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              Choisissez un nouveau mot de passe pour votre compte.
            </p>
          </div>

          <div className="px-8 py-10">

            {/* Cas 1 : token invalide ou manquant */}
            {tokenError && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-6 text-center text-sm text-red-800">
                  <p className="text-2xl mb-3">⚠️</p>
                  <p className="font-semibold text-base mb-2">Lien invalide</p>
                  <p>{tokenError}</p>
                </div>
                <div className="text-center text-sm">
                  <a
                    href="/forgot-password"
                    className="font-semibold text-orange-600 hover:text-orange-700"
                  >
                    Demander un nouveau lien
                  </a>
                </div>
              </div>
            )}

            {/* Cas 2 : succès — mot de passe mis à jour */}
            {!tokenError && successMessage && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-6 text-center text-sm text-emerald-800">
                  <p className="text-2xl mb-3">✅</p>
                  <p className="font-semibold text-base mb-2">Mot de passe mis à jour !</p>
                  <p>{successMessage}</p>
                  <p className="mt-3 text-slate-500">Redirection vers la connexion...</p>
                </div>
              </div>
            )}

            {/* Cas 3 : formulaire normal */}
            {!tokenError && !successMessage && (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                <FormInput
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  label="Nouveau mot de passe"
                  value={formValues.newPassword}
                  onChange={handleChange}
                  placeholder="Min. 6 caractères"
                  error={errors.newPassword}
                />

                <FormInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirmer le mot de passe"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  placeholder="Retapez le mot de passe"
                  error={errors.confirmPassword}
                />

                {generalError && (
                  <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
                    {generalError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !accessToken}
                  className="inline-flex w-full items-center justify-center rounded-3xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
                >
                  {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                </button>

              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}