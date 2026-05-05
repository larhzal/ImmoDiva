// L'utilisateur saisit son email → backend appelle Supabase → Supabase envoie le lien
// Le lien redirige vers /reset-password#access_token=xxx&type=recovery

import React, { useState } from 'react';
import Logo      from '../../assets/images/Logo.png';
import FormInput from '../../components/ui/FormInput';

const API_URL    = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email,          setEmail]          = useState('');
  const [emailError,     setEmailError]     = useState('');
  const [loading,        setLoading]        = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError,   setGeneralError]   = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
    setGeneralError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setGeneralError('');
    setEmailError('');

    if (!email.trim()) {
      setEmailError("L'adresse email est requise.");
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Veuillez saisir un email valide.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setGeneralError(data.message || 'Une erreur est survenue.');
        return;
      }

      // Toujours afficher ce message même si l'email n'existe pas (sécurité)
      setSuccessMessage(data.message || 'Un lien de réinitialisation a été envoyé.');
      setEmail('');
    } catch {
      setGeneralError('Impossible de contacter le serveur.');
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
          <div className="bg-orange-100 px-8 py-10 text-center">
            <img src={Logo} alt="ImmoDIVA" className="mx-auto h-16 w-auto" />
            <h1 className="mt-6 text-3xl font-semibold text-slate-900">Mot de passe oublié</h1>
            <p className="mt-3 text-sm text-slate-600">
              Entrez votre email et nous vous enverrons un lien de réinitialisation.
            </p>
          </div>

          {/* Corps */}
          <div className="px-8 py-10">
            {successMessage ? (
              /* ── Succès ── */
              <div className="space-y-6">
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center text-sm text-emerald-800">
                  {/* <p className="text-2xl mb-3">📧</p> */}
                  <p className="font-semibold text-base mb-2">Email envoyé !</p>
                  <p>{successMessage}</p>
                  <p className="mt-3 text-slate-500">Vérifiez aussi votre dossier spam.</p>
                </div>
                <div className="text-center text-sm">
                  <a href="/login" className="font-semibold text-orange-600 hover:text-orange-700">
                    ← Retour à la connexion
                  </a>
                </div>
              </div>
            ) : (
              /* ── Formulaire ── */
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  label="Adresse email"
                  value={email}
                  onChange={handleChange}
                  placeholder="email@exemple.com"
                  error={emailError}
                />

                {generalError && (
                  <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
                    {generalError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-3xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
                >
                  {loading ? 'Envoi en cours…' : 'Envoyer le lien'}
                </button>

                <div className="text-center text-sm text-slate-500">
                  <a href="/login" className="font-semibold text-orange-600 hover:text-orange-700">
                    ← Retour à la connexion
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}