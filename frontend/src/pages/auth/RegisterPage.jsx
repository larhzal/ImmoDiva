import React, { useState } from 'react';
import Logo from '../../assets/images/Logo.png';
import FormInput from '../../components/ui/FormInput';
import { registerUser } from '../../services/authService';

const initialState = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone_number: '',
  password: '',
  confirmPassword: '',
};

// Regex : au moins 1 majuscule, 1 minuscule, 1 chiffre, 8 caractères minimum
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const emailRegex    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Lettres uniquement (avec accents)
const lettersOnlyRegex = /^[A-Za-zÀ-ÿ\s'-]+$/;

function validate(values) {
  const errors = {};

  if (!values.firstName.trim()) {
    errors.firstName = 'Le prénom est requis.';
  } else if (!lettersOnlyRegex.test(values.firstName.trim())) {
    errors.firstName = 'Le prénom ne doit contenir que des lettres.';
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Le nom est requis.';
  } else if (!lettersOnlyRegex.test(values.lastName.trim())) {
    errors.lastName = 'Le nom ne doit contenir que des lettres.';
  }

  if (!values.username.trim()) {
    errors.username = "Le nom d'utilisateur est requis.";
  }

  if (!values.email.trim()) {
    errors.email = "L'email est requis.";
  } else if (!emailRegex.test(values.email)) {
    errors.email = 'Veuillez saisir un email valide.';
  }

  if (!values.phone_number.trim()) {
    errors.phone_number = 'Le numéro de téléphone est requis.';
  } else if (!/^\+?[0-9\s]{8,15}$/.test(values.phone_number.trim())) {
    errors.phone_number = 'Numéro invalide. Ex: +212 6XX XXX XXX';
  }

  if (!values.password) {
    errors.password = 'Le mot de passe est requis.';
  } else if (!passwordRegex.test(values.password)) {
    errors.password =
      'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'La confirmation du mot de passe est requise.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas.';
  }

  return errors;
}

export default function RegisterPage() {
  const [formValues, setFormValues] = useState(initialState);
  const [errors,     setErrors]     = useState({});
  const [loading,    setLoading]    = useState(false);
  const [apiError,   setApiError]   = useState('');

  // Filtre selon le type de champ
  const handleChange = (event) => {
    const { name, value } = event.target;
    let filtered = value;

    // Nom / Prénom : lettres + espaces + tirets + apostrophes uniquement
    if (name === 'firstName' || name === 'lastName') {
      filtered = value.replace(/[^A-Za-zÀ-ÿ\s'-]/g, '');
    }

    // Téléphone : chiffres, espaces, +, tirets uniquement
    if (name === 'phone_number') {
      // Autoriser + uniquement en première position
      filtered = value.replace(/[^\d\s+\-]/g, '');
      if (filtered.indexOf('+') > 0) {
        filtered = filtered.replace(/\+/g, '');
      }
    }

    setFormValues((current) => ({ ...current, [name]: filtered }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setApiError('');

    const validationErrors = validate(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const payload = {
      first_name:   formValues.firstName.trim(),
      last_name:    formValues.lastName.trim(),
      username:     formValues.username.trim(),
      email:        formValues.email.trim(),
      phone_number: formValues.phone_number.trim(),
      password:     formValues.password,
    };

    // Récupérer le rôle choisi depuis sessionStorage (RolePage → RegisterPage)
    const storedRole = sessionStorage.getItem('selectedRole');
    if (storedRole) {
      payload.role = storedRole;
    } else {
      setApiError('Veuillez d\'abord choisir un rôle');
      setLoading(false);
      return;
    }

    try {
      // Appeler l'API d'enregistrement
      const response = await registerUser(payload);
      
      // Stocker le token et les données utilisateur
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      // Nettoyer le sessionStorage
      sessionStorage.removeItem('selectedRole');
      sessionStorage.removeItem('registrationData');

      // Redirection selon le rôle
      setTimeout(() => {
        if (storedRole === 'Client') {
          window.location.href = '/';
        } else if (storedRole === 'Publisher') {
          window.location.href = '/listings';
        } else {
          window.location.href = '/';
        }
      }, 500);
    } catch (error) {
      setApiError(error.message || 'Une erreur s\'est produite lors de l\'enregistrement');
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
            <h1 className="mt-6 text-3xl font-semibold text-slate-900">Créer un compte</h1>
            <p className="mt-3 text-sm text-slate-600">
              Remplissez ce formulaire pour finaliser votre inscription.
            </p>
          </div>

          {/* Formulaire */}
          <div className="px-8 py-10">
            {apiError && (
              <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                {apiError}
              </div>
            )}
            <form onSubmit={handleRegister} className="space-y-6" noValidate>

              <div className="grid gap-6 md:grid-cols-2">
                <FormInput
                  id="lastName"
                  name="lastName"
                  label="Nom"
                  value={formValues.lastName}
                  onChange={handleChange}
                  placeholder="Entrez votre nom"
                  error={errors.lastName}
                />
                <FormInput
                  id="firstName"
                  name="firstName"
                  label="Prénom"
                  value={formValues.firstName}
                  onChange={handleChange}
                  placeholder="Entrez votre prénom"
                  error={errors.firstName}
                />
              </div>

              <FormInput
                id="username"
                name="username"
                label="Identifiant"
                value={formValues.username}
                onChange={handleChange}
                placeholder="Entrez un identifiant"
                error={errors.username}
              />

              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="email@exemple.com"
                error={errors.email}
              />

              <FormInput
                id="phone_number"
                name="phone_number"
                type="tel"
                label="Numéro de téléphone"
                value={formValues.phone_number}
                onChange={handleChange}
                placeholder="+212 6XX XXX XXX"
                error={errors.phone_number}
              />

              <FormInput
                id="password"
                name="password"
                type="password"
                label="Mot de passe"
                value={formValues.password}
                onChange={handleChange}
                placeholder="Min. 8 car., 1 maj., 1 min., 1 chiffre"
                error={errors.password}
              />

              {/* Indicateur de force du mot de passe */}
              {formValues.password && (
                <PasswordStrength password={formValues.password} />
              )}

              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirmation du mot de passe"
                value={formValues.confirmPassword}
                onChange={handleChange}
                placeholder="Retapez le mot de passe"
                error={errors.confirmPassword}
              />

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-3xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
              >
                {loading ? 'Chargement...' : 'Continuer'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Vous avez déjà un compte ?{' '}
              <a href="/login" className="font-semibold text-orange-600 hover:text-orange-700">
                Se connecter
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Composant indicateur de force du mot de passe ── */
function PasswordStrength({ password }) {
  const checks = [
    { label: '8 caractères minimum', ok: password.length >= 8 },
    { label: 'Une lettre majuscule', ok: /[A-Z]/.test(password) },
    { label: 'Une lettre minuscule', ok: /[a-z]/.test(password) },
    { label: 'Un chiffre',           ok: /\d/.test(password) },
  ];

  return (
    <ul className="space-y-1 text-xs">
      {checks.map(({ label, ok }) => (
        <li key={label} className={`flex items-center gap-2 ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>
          <span>{ok ? '✓' : '○'}</span>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}