import React, { useState } from 'react';
import Logo from '../../assets/images/Logo.png';
import FormInput from '../../components/ui/FormInput';

const initialState = {
  username: '',
  password: '',
};

function validate(values) {
  const errors = {};

  // BUG CORRIGÉ : apostrophe typographique ' → apostrophe droite ' (syntax error)
  if (!values.username.trim()) {
    errors.username = "L'identifiant est requis.";
  }

  if (!values.password) {
    errors.password = 'Le mot de passe est requis.';
  } else if (values.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
  }

  return errors;
}

export default function LoginPage() {
  const [formValues, setFormValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [generalError, setGeneralError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setGeneralError('');
    setSuccessMessage('');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setGeneralError('');

    const validationErrors = validate(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setGeneralError('Veuillez corriger les erreurs ci-dessous.');
      return;
    }

    setLoading(true);

    // BUG CORRIGÉ : suppression de provider: 'supabase' (pas de backend encore)
    const payload = {
      username: formValues.username.trim(),
      password: formValues.password,
    };

    console.log('Login payload', payload);

    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Connexion simulée réussie.');
      setFormValues(initialState);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-orange-50 text-slate-900">
      <div className="h-32 bg-orange-400" />
      <main className="mx-auto -mt-24 flex w-full max-w-md flex-col items-center px-4 pb-12 sm:px-6">
        <div className="w-full overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-soft">
          <div className="bg-orange-100 px-8 py-10 text-center">
            <img src={Logo} alt="ImmoDIVA" className="mx-auto h-16 w-auto" />
            <h1 className="mt-6 text-3xl font-semibold text-slate-900">Connexion</h1>
            <p className="mt-3 text-sm text-slate-600">
              Connectez-vous pour accéder à votre espace client.
            </p>
          </div>

          <div className="px-8 py-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <FormInput
                id="username"
                name="username"
                label="Identifiant"
                value={formValues.username}
                onChange={handleChange}
                placeholder="Entrez votre identifiant"
                error={errors.username}
              />

              <FormInput
                id="password"
                name="password"
                type="password"
                label="Mot de passe"
                value={formValues.password}
                onChange={handleChange}
                placeholder="Entrez votre mot de passe"
                error={errors.password}
              />

              {generalError && (
                <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
                  {generalError}
                </div>
              )}

              {successMessage && (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-3xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            {/* AJOUT : lien "Mot de passe oublié ?" — requis dans les specs (NB du PDF) */}
            <div className="mt-4 text-center text-sm">
              <a
                href="/reset-password"
                className="font-medium text-orange-500 hover:text-orange-600"
              >
                Mot de passe oublié ?
              </a>
            </div>

            <div className="mt-3 text-center text-sm text-slate-500">
              Pas encore de compte ?{' '}
              <a href="/register" className="font-semibold text-orange-600 hover:text-orange-700">
                Créer un compte
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}